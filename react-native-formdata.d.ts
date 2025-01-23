declare global {
    interface FormData {
      append(name: string, value: any): void; // Override to accept any value
    }
  }
  