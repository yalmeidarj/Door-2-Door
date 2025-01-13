import { ResultsData } from "@/components/maps/AddressMap";


export const sampleResultsData: ResultsData = {
  results: [
    {
      query: "123 Main St, Anytown, USA",
      response: {
        results: [
          {
            formatted_address: "123 Main St, Anytown, CA 12345, USA",
            location: {
              lat: 37.7749,
              lng: -122.4194,
            },
            accuracy: 0.9,
            accuracy_type: "rooftop",
          },
        ],
      },
    },
    {
      query: "456 Elm St, Another City, USA",
      response: {
        results: [
          {
            formatted_address: "456 Elm St, Another City, NY 67890, USA",
            location: {
              lat: 40.7128,
              lng: -74.006,
            },
            accuracy: 0.8,
            accuracy_type: "range_interpolated",
          },
        ],
      },
    },
    {
      query: "789 Oak Ave, Somewhere, USA",
      response: {
        results: [
          {
            formatted_address: "789 Oak Ave, Somewhere, TX 54321, USA",
            location: {
              lat: 29.7604,
              lng: -95.3698,
            },
            accuracy: 0.95,
            accuracy_type: "rooftop",
          },
        ],
      },
    },
  ],
};
