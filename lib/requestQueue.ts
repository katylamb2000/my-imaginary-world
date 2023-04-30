import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

class RequestQueue {
  maxConcurrentRequests: number;
  pendingRequests: (() => Promise<void>)[];
  activeRequests: number;

  constructor(maxConcurrentRequests: number) {
    this.maxConcurrentRequests = maxConcurrentRequests;
    this.pendingRequests = [];
    this.activeRequests = 0;
  }

  async addToQueue(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const request = async () => {
        try {
          if (this.activeRequests >= this.maxConcurrentRequests) return;
          this.activeRequests++;
          const response = await axios(config);
          this.activeRequests--;
          resolve(response);
          this.processQueue();
        } catch (error) {
          reject(error);
        }
      };
      this.pendingRequests.push(request);
      this.processQueue();
    });
  }

  processQueue() {
    if (this.activeRequests < this.maxConcurrentRequests && this.pendingRequests.length > 0) {
      const request = this.pendingRequests.shift();
      if (request) request();
    }
  }
}

export default RequestQueue;

