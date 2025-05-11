"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Ensure Button component exists in your project
import Header from "@/components/Header"; // Ensure you have a Header component
import Footer from "@/components/Footer"; // Ensure you have a Footer component
import CustomCursor from "@/components/CustomCursor"; // Ensure you have a CustomCursor component
import "@fontsource/poppins"; // Ensure the font is installed and used correctly
import "@/styles/typography.js"; // Ensure this file exists
import "@/styles/project-page.css"; // Ensure this CSS file is available
import "@/styles/globals.css"; // Ensure global styles are included
import { uploadFile } from '../../firebase';

// Define the questionnaire fields in one place
const QUESTIONNAIRE_FIELDS = 
[
  { name: "emri", label: "Emri dhe Mbiemri", type: "text" },
  { name: "ditelindja", label: "Data e lindjes", type: "text" },
  { name: "vendlindja", label: "Vendlindja", type: "text" },
  { name: "vendbanimiAktual", label: "Vendbanimi aktual", type: "text" },
  { name: "email", label: "E-mail për kontakt", type: "text" },
  {
    name: "rrëfim",
    label: "Çfarë të sjell ndër mend fjala 'luftë'? Ndaj me ne një kujtim, një përvojë ose një ndjesi që e mban ende me vete.",
    type: "textarea"
  },
  {
    name: "mbartje",
    label: "Çfarë mbart ende nga ajo kohë - shpresë, frikë, forcë apo peng?",
    type: "textarea"
  }
] as const;

type QuestionnaireField = typeof QUESTIONNAIRE_FIELDS[number];
type FormDataState = {
  [K in QuestionnaireField['name']]: string;
} & {
  images: File[];
  videos: File[];
};

export default function ShareYourStory() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const initialFormData = QUESTIONNAIRE_FIELDS.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    { images: [] as File[], videos: [] as File[] }
  ) as FormDataState;
  const [formData, setFormData] = useState<FormDataState>(initialFormData);

  // Audio recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);

  // New state to handle title hover/click
  const [titleActive, setTitleActive] = useState(false);

  // State for consent and inclusion
  const [consent, setConsent] = useState(false);
  const [inclusion, setInclusion] = useState<'anonim' | 'emer'>('emer');

  // Start/stop recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const chunks: BlobPart[] = [];
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const file = new File([blob], `recording_${Date.now()}.webm`, { type: "audio/webm" });
      setAudioFiles((prev) => [...prev, file]);
      setRecordingSeconds(0);
    };
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingSeconds(0);
  };
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Timer effect for recording
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      // Only allow 'images' and 'videos' for file arrays
      if (name === "images" || name === "videos") {
        setFormData((prev) => ({
          ...prev,
          [name]: prev[name as "images" | "videos"]
            ? [...(prev[name as "images" | "videos"] as File[]), ...fileList]
            : fileList,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  };

  // Remove audio file
  const removeAudio = (idx: number) => {
    setAudioFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Remove image or video file
  const removeFile = (type: 'images' | 'videos', idx: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_: File, i: number) => i !== idx)
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation: All questions mandatory, but for each, either text or audio required
    let valid = true;
    for (const field of QUESTIONNAIRE_FIELDS) {
      if (field.type === 'textarea') {
        const text = formData[field.name];
        const hasAudio = audioFiles.length > 0;
        if (!text && !hasAudio) {
          valid = false;
          alert('Ju lutemi përgjigjuni çdo pyetjeje me shkrim ose zë.');
          break;
        }
      } else if (!formData[field.name]) {
        valid = false;
        alert('Ju lutemi plotësoni të gjitha fushat e detyrueshme.');
        break;
      }
    }
    if (!consent) {
      alert('Ju lutemi jepni pëlqimin tuaj për përdorimin e materialeve.');
      return;
    }
    if (!valid) return;

    // 1. Upload files to Firebase Storage and get URLs
    let imageUrls: string[] = [];
    let videoUrls: string[] = [];
    let audioUrls: string[] = [];
    // Use the same folder name logic as backend
    const safe = (str: string) => (str || "anon").toLowerCase().replace(/[^a-z0-9]/gi, "_");
    const folderName = `${safe(formData.vendlindja)}-${safe(formData.emri)}`;
    try {
      if (formData.images && formData.images.length > 0) {
        imageUrls = await Promise.all(formData.images.map(file => uploadFile(file, folderName)));
      }
      if (formData.videos && formData.videos.length > 0) {
        videoUrls = await Promise.all(formData.videos.map(file => uploadFile(file, folderName)));
      }
      if (audioFiles.length > 0) {
        audioUrls = await Promise.all(audioFiles.map(file => uploadFile(file, folderName)));
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Ngarkimi i skedarëve dështoi. Ju lutemi provoni përsëri.');
      return;
    }

    // 2. Prepare form data with file URLs instead of files
    const dataToSend: any = { ...formData };
    dataToSend.images = imageUrls;
    dataToSend.videos = videoUrls;
    dataToSend.audio = audioUrls;

    // 3. Send the data to the backend (as JSON)
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData(initialFormData);
        setAudioFiles([]);
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data?.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Typewriter effect for the title
  const titleFull = "një shtëpi, një rrugë";
  const [titleIndex, setTitleIndex] = useState(0);
  useEffect(() => {
    if (titleIndex < titleFull.length) {
      const timeout = setTimeout(() => setTitleIndex(titleIndex + 1), 120);
      return () => clearTimeout(timeout);
    }
  }, [titleIndex, titleFull.length]);

  // Helper for rendering text or textarea
  const renderField = (field: typeof QUESTIONNAIRE_FIELDS[number]) => (
    <div className="mb-4" key={field.name}>
      <label htmlFor={field.name} className="block mb-1 font-medium text-gray-700">{field.label}</label>
      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          name={field.name}
          value={formData[field.name] as string}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          rows={3}
        />
      ) : (
        <input
          type={field.type}
          id={field.name}
          name={field.name}
          value={formData[field.name] as string}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
        />
      )}
      {/* Place audio recorder directly under email field */}
      {field.name === "email" && (
        <div className="mb-4 mt-2">
          <label className="block mb-1 font-medium text-gray-700">Regjistro një mesazh zanor:</label>
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                aria-label="Fillo regjistrimin"
                className="record-btn flex items-center justify-center"
              >
                <span className="record-circle" />
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                aria-label="Përfundo regjistrimin"
                className="record-btn flex items-center justify-center"
              >
                <span className="record-circle recording" />
              </button>
            )}
            {isRecording && (
              <span className="text-sm text-gray-700">{recordingSeconds}s</span>
            )}
          </div>
          {audioFiles.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600">
              {audioFiles.map((file, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {file.name}
                  <button type="button" className="text-red-600 ml-2" onClick={() => removeAudio(idx)}>X</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );

  // Custom circular checkbox and radio CSS (lighter, simpler)
  const customInputStyles = `
    .record-btn {
      width: 50px;
      height: 50px;
      padding: 0;
      border: none;
      background: none;
      outline: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .record-circle {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: #fff;
      border: 3px solid #22c55e;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.2s cubic-bezier(.4,2,.6,1);
    }
    .record-circle::after {
      content: '';
      display: block;
      width: 28px;
      height: 28px;
      background: #22c55e;
      border-radius: 50%;
      transition: all 0.2s cubic-bezier(.4,2,.6,1);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .record-circle.recording::after {
      width: 20px;
      height: 20px;
      background: #22c55e;
      border-radius: 7px;
      transition: all 0.2s cubic-bezier(.4,2,.6,1);
    }
    /* Confirmation/inclusion/consent circles */
    input[type='checkbox'], input[type='radio'] {
      appearance: none;
      -webkit-appearance: none;
      background-color: #fff;
      margin: 0;
      font: inherit;
      color: #333;
      width: 1.25em;
      height: 1.25em;
      border: 2px solid #bbb;
      border-radius: 50%;
      display: grid;
      place-content: center;
      transition: border-color 0.2s, background 0.2s;
      box-shadow: none;
    }
    input[type='checkbox']:checked, input[type='radio']:checked {
      background-color:rgb(158, 163, 174);
      border-color:rgb(158, 163, 174);
    }
    /* Remove white dot for checked state */
    input[type='checkbox']:checked::before, input[type='radio']:checked::before {
      display: none;
    }
  `;

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      <CustomCursor />
      <Header />
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg.jpg')", filter: "brightness(0.7)" }}
      />
      <div className="relative z-10 flex-1 flex flex-col justify-between min-h-0">
        {/* Center the title absolutely over the background image */}
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ pointerEvents: showForm ? "none" : "auto" }}
        >
          <h1
            className={`
              text-4xl
              md:text-6xl
              lg:text-8xl
              font-light
              text-center
              transition-colors
              duration-200
              cursor-pointer
              select-none
              ${titleActive ? "text-black" : "text-white"}
            `}
            style={{
              fontFamily: "Poppins, serif",
              textShadow: titleActive ? "none" : "0 2px 16px rgba(0,0,0,0.3)",
              letterSpacing: "0.04em",
              whiteSpace: "pre",
            }}
            tabIndex={0}
            onMouseEnter={() => setTitleActive(true)}
            onMouseLeave={() => setTitleActive(false)}
            onFocus={() => setTitleActive(true)}
            onBlur={() => setTitleActive(false)}
            onClick={() => setShowForm(true)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") setShowForm(true);
            }}
            aria-label="Hap pyetësorin"
          >
            {titleFull.slice(0, titleIndex)}
            <span className="inline-block w-2 animate-blink">|</span>
          </h1>
        </div>
        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .animate-blink {
            animation: blink 0.7s steps(1) infinite;
          }
          ${customInputStyles}
        `}</style>
        {/* Overlay only the background image area */}
        {showForm && (
          <>
            {/* Phone layout (visible on small screens) */}
            <div
              className="absolute inset-0 z-40 flex flex-col items-center justify-center md:hidden"
              style={{ pointerEvents: "auto" }}
              onClick={() => setShowForm(false)}
            >
              <div
                className={`
                  relative
                  mx-auto
                  bg-white
                  p-2
                  rounded-2xl
                `}
                style={{
                  borderRadius: "1rem",
                  width: "85%",
                  maxWidth: "100vw",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  marginTop: "1rem",
                  marginBottom: "4rem",
                  pointerEvents: "auto",
                }}
                onClick={e => e.stopPropagation()}
              >
                <div
                  className="hide-scrollbar custom-scrollbar"
                  style={{
                    maxHeight: "70vh",
                    overflowY: "auto",
                  }}
                >
                  {/* Modal content for phone */}
                  {!submitted ? (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                      <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Ndaje historinë tënde</h2>
                      <p className="mb-6 text-center text-gray-700 text-base">
                        Më poshtë do të gjeni një formular me disa pyetje rreth jush dhe kujtimeve tuaja. Mund t’i përgjigjeni me shkrim ose duke regjistruar zë përmes butonit "Regjistro".<br/>
                        Jeni të lirë të tregoni historinë tuaj ashtu siç e ndjeni, pa u ndikuar nga vetë pyetjet.<br/>
                        Nëse hasni ndonjë problem gjatë dorëzimit, na kontaktoni në e-mail: info@aritadreshaj.com
                      </p>
                      {renderField(QUESTIONNAIRE_FIELDS.find(f => f.name === "emri")!)}
                      {renderField(QUESTIONNAIRE_FIELDS.find(f => f.name === "ditelindja")!)}
                      <div className="mb-4 flex flex-row gap-4">
                        <div className="flex-1">
                          <label htmlFor="vendlindja" className="block mb-1 font-medium text-gray-700">Vendlindja</label>
                          <input
                            type="text"
                            id="vendlindja"
                            name="vendlindja"
                            value={formData.vendlindja}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor="vendbanimiAktual" className="block mb-1 font-medium text-gray-700">Vendbanimi aktual</label>
                          <input
                            type="text"
                            id="vendbanimiAktual"
                            name="vendbanimiAktual"
                            value={formData.vendbanimiAktual}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                          />
                        </div>
                      </div>
                      {QUESTIONNAIRE_FIELDS.filter(
                        f =>
                          f.name !== "emri" &&
                          f.name !== "ditelindja" &&
                          f.name !== "vendlindja" &&
                          f.name !== "vendbanimiAktual"
                      ).map(renderField)}
                      <div className="mb-6">
                        <label className="block mb-1 font-medium text-gray-700">
                          Përfshini foto ose video që pasqyrojnë rrëfimin tuaj
                        </label>
                        <div className="flex flex-row gap-4">
                          <label className="cursor-pointer">
                            <Button
                              type="button"
                              className="mr-2 bg-gray-400 text-white"
                              tabIndex={-1}
                              onClick={e => {
                                e.preventDefault();
                                document.getElementById("upload-images")?.click();
                              }}
                            >
                              Ngarko foto
                            </Button>
                            <input
                              id="upload-images"
                              type="file"
                              name="images"
                              multiple
                              accept="image/*,.jpg,.jpeg,.png,.gif"
                              onChange={handleChange}
                              className="hidden"
                            />
                          </label>
                          <label className="cursor-pointer">
                            <Button
                              type="button"
                              className="mr-2 bg-gray-400 text-white"
                              tabIndex={-1}
                              onClick={e => {
                                e.preventDefault();
                                document.getElementById("upload-videos")?.click();
                              }}
                            >
                              Ngarko video
                            </Button>
                            <input
                              id="upload-videos"
                              type="file"
                              name="videos"
                              multiple
                              accept="video/*"
                              onChange={handleChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {formData.images.length > 0 && (
                          <ul className="mt-2 text-sm text-gray-600">
                            {formData.images.map((file, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                {file.name}
                                <button type="button" className="text-red-600 ml-2" onClick={() => removeFile('images', idx)}>X</button>
                              </li>
                            ))}
                          </ul>
                        )}
                        {formData.videos.length > 0 && (
                          <ul className="mt-2 text-sm text-gray-600">
                            {formData.videos.map((file, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                {file.name}
                                <button type="button" className="text-red-600 ml-2" onClick={() => removeFile('videos', idx)}>X</button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="mb-4 mt-6">
                        <label className="flex items-center gap-2 font-medium text-gray-700">
                          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required />
                          Ju lutemi, jepni pëlqimin tuaj që materialet e mbledhura të përdoren për qëllime studimore dhe hulumtime të mëtejshme.
                        </label>
                      </div>
                      <div className="mb-6">
                        <label className="block mb-1 font-medium text-gray-700">Zgjedhje e përfshirjes:</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1 font-medium text-gray-700">
                            <input type="radio" name="inclusion" value="emer" checked={inclusion === 'emer'} onChange={() => setInclusion('emer')} />
                            me emer
                          </label>
                          <label className="flex items-center gap-1 font-medium text-gray-700">
                            <input type="radio" name="inclusion" value="anonim" checked={inclusion === 'anonim'} onChange={() => setInclusion('anonim')} />
                            anonim
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button type="submit" className="bg-black text-white px-8 py-2 rounded-lg shadow">Dërgo</Button>
                        <Button type="button" className="ml-4" variant="outline" onClick={() => setShowForm(false)}>Mbyll</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-16">
                      <p className="text-2xl text-center text-black font-semibold mb-6">Faleminderit!</p>
                      <Button className="bg-black text-white" onClick={() => { setShowForm(false); setSubmitted(false); }}>Mbyll</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Web/desktop layout (visible on md and up) */}
            <div
              className="absolute inset-0 z-40 hidden md:flex flex-col items-center justify-center"
              style={{ pointerEvents: "auto" }}
              onClick={() => setShowForm(false)}
            >
              <div
                className={`
                  relative
                  w-full
                  max-w-2xl
                  lg:max-w-5xl
                  mx-auto
                  bg-white
                  p-10
                  md:p-12
                  rounded-2xl
                `}
                style={{
                  borderRadius: "1rem",
                  width: "75%",
                  maxWidth: "90vw",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  marginTop: "10rem",
                  marginBottom: "14rem",
                  pointerEvents: "auto",
                }}
                onClick={e => e.stopPropagation()}
              >
                <div
                  className="hide-scrollbar custom-scrollbar"
                  style={{
                    maxHeight: "60vh",
                    overflowY: "auto",
                  }}
                >
                  {/* Modal content for desktop */}
                  {!submitted ? (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                      <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Ndaje historinë tënde</h2>
                      <p className="mb-6 text-center text-gray-700 text-base">
                        Më poshtë do të gjeni një formular me disa pyetje rreth jush dhe kujtimeve tuaja. Mund t’i përgjigjeni me shkrim ose duke regjistruar zë përmes butonit "Regjistro".<br/>
                        Jeni të lirë të tregoni historinë tuaj ashtu siç e ndjeni, pa u ndikuar nga vetë pyetjet.<br/>
                        Nëse hasni ndonjë problem gjatë dorëzimit, na kontaktoni në e-mail: info@aritadreshaj.com
                      </p>
                      {renderField(QUESTIONNAIRE_FIELDS.find(f => f.name === "emri")!)}
                      {renderField(QUESTIONNAIRE_FIELDS.find(f => f.name === "ditelindja")!)}
                      <div className="mb-4 flex flex-row gap-4">
                        <div className="flex-1">
                          <label htmlFor="vendlindja" className="block mb-1 font-medium text-gray-700">Vendlindja</label>
                          <input
                            type="text"
                            id="vendlindja"
                            name="vendlindja"
                            value={formData.vendlindja}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor="vendbanimiAktual" className="block mb-1 font-medium text-gray-700">Vendbanimi aktual</label>
                          <input
                            type="text"
                            id="vendbanimiAktual"
                            name="vendbanimiAktual"
                            value={formData.vendbanimiAktual}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                          />
                        </div>
                      </div>
                      {QUESTIONNAIRE_FIELDS.filter(
                        f =>
                          f.name !== "emri" &&
                          f.name !== "ditelindja" &&
                          f.name !== "vendlindja" &&
                          f.name !== "vendbanimiAktual"
                      ).map(renderField)}
                      <div className="mb-6">
                        <label className="block mb-1 font-medium text-gray-700">
                          Përfshini foto ose video që pasqyrojnë rrëfimin tuaj.
                        </label>
                        <div className="flex flex-row gap-4">
                          <label className="cursor-pointer">
                            <Button
                              type="button"
                              className="mr-2 bg-gray-400 text-white"
                              tabIndex={-1}
                              onClick={e => {
                                e.preventDefault();
                                document.getElementById("upload-images")?.click();
                              }}
                            >
                              Ngarko foto
                            </Button>
                            <input
                              id="upload-images"
                              type="file"
                              name="images"
                              multiple
                              accept="image/*,.jpg,.jpeg,.png,.gif"
                              onChange={handleChange}
                              className="hidden"
                            />
                          </label>
                          <label className="cursor-pointer">
                            <Button
                              type="button"
                              className="mr-2 bg-gray-400 text-white"
                              tabIndex={-1}
                              onClick={e => {
                                e.preventDefault();
                                document.getElementById("upload-videos")?.click();
                              }}
                            >
                              Ngarko video
                            </Button>
                            <input
                              id="upload-videos"
                              type="file"
                              name="videos"
                              multiple
                              accept="video/*"
                              onChange={handleChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {formData.images.length > 0 && (
                          <ul className="mt-2 text-sm text-gray-600">
                            {formData.images.map((file, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                {file.name}
                                <button type="button" className="text-red-600 ml-2" onClick={() => removeFile('images', idx)}>X</button>
                              </li>
                            ))}
                          </ul>
                        )}
                        {formData.videos.length > 0 && (
                          <ul className="mt-2 text-sm text-gray-600">
                            {formData.videos.map((file, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                {file.name}
                                <button type="button" className="text-red-600 ml-2" onClick={() => removeFile('videos', idx)}>X</button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="mb-4 mt-6">
                        <label className="flex items-center gap-2 font-medium text-gray-700">
                          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required />
                          Ju lutemi, jepni pëlqimin tuaj që materialet e mbledhura të përdoren për qëllime studimore dhe hulumtime të mëtejshme.
                        </label>
                      </div>
                      <div className="mb-6">
                        <label className="block mb-1 font-medium text-gray-700">Zgjedhje e përfshirjes:</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1 font-medium text-gray-700">
                            <input type="radio" name="inclusion" value="emer" checked={inclusion === 'emer'} onChange={() => setInclusion('emer')} />
                            me emer
                          </label>
                          <label className="flex items-center gap-1 font-medium text-gray-700">
                            <input type="radio" name="inclusion" value="anonim" checked={inclusion === 'anonim'} onChange={() => setInclusion('anonim')} />
                            anonim
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button type="submit" className="bg-black text-white px-8 py-2 rounded-lg shadow">Dërgo</Button>
                        <Button type="button" className="ml-4" variant="outline" onClick={() => setShowForm(false)}>Mbyll</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-16">
                      <p className="text-2xl text-center text-black font-semibold mb-6">Faleminderit!</p>
                      <Button className="bg-black text-white" onClick={() => { setShowForm(false); setSubmitted(false); }}>Mbyll</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Sticky footer at the bottom */}
      <div className="w-full fixed left-0 bottom-0 z-50">
        <Footer />
      </div>
    </div>
  );
}