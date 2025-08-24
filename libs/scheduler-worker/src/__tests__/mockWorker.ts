export class MockWorker implements Worker {
  onmessage: ((this: Worker, event_: MessageEvent) => unknown) | null = null;
  onmessageerror: ((this: Worker, event_: MessageEvent) => unknown) | null = null;
  onerror: ((this: Worker, event_: ErrorEvent) => unknown) | null = null;

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
                            start: 32_400,
                            end: 61_200,
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

  postMessage(): void {
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
