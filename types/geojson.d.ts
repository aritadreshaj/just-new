declare module "*.geojson" {
  const value: {
    type: string;
    features: Array<{
      type?: string;
      geometry: {
        type: string;
        coordinates: unknown;
      };
      properties?: Record<string, unknown>;
    }>;
  };

  export default value;
}
