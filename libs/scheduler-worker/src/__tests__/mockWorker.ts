export class MockWorker implements Worker {
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null = null;
  onmessageerror: ((this: Worker, ev: MessageEvent) => any) | null = null;
  onerror: ((this: Worker, ev: ErrorEvent) => any) | null = null;

  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    // Simulate worker initialization
    setTimeout(() => {
      this.startGeneratingProgress();
    }, 0);
  }

  private startGeneratingProgress() {
    this.intervalId = setInterval(() => {
      if (this.onmessage) {
        this.onmessage({
          data: {
            cycleCount: Math.floor(Math.random() * 100),
            computed: Math.floor(Math.random() * 50),
            discardedReasons: new Map(),
            problemInSlotIds: new Map(),
            topSolutions: [
              {
                score: Math.random(),
                heuristicScores: [],
                schedule: {
                  startDay: "2024-03-15",
                  endDay: "2024-03-16",
                  shifts: [
                    {
                      slot: {
                        id: "slot1",
                        workHours: [
                          {
                            start: 32400,
                            end: 61200,
                            inconvenienceMultiplier: 1,
                          },
                        ],
                        startsOnDay: "2024-03-15",
                        requiredQualifications: ["qualification1"],
                        typeName: "regular",
                      },
                      assigned: {
                        pk: "1",
                        name: "Worker 1",
                        email: "worker1@example.com",
                        emailMd5: "hash1",
                        qualifications: ["qualification1"],
                        approvedLeaves: [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        } as MessageEvent);
      }
    }, 100);
  }

  postMessage(message: any): void {
    // Simulate worker receiving message
  }

  terminate(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  addEventListener(): void {}
  removeEventListener(): void {}
  dispatchEvent(): boolean {
    return true;
  }
}
