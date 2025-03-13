export class MockWorker {
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onmessageerror: ((ev: MessageEvent) => void) | null = null;
  onerror: ((ev: ErrorEvent) => void) | null = null;

  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    setTimeout(() => {
      this.startGeneratingProgress();
    }, 0);
  }

  private startGeneratingProgress() {
    this.intervalId = setInterval(() => {
      if (this.onmessage) {
        this.onmessage(
          new MessageEvent("message", {
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
          })
        );
      }
    }, 100);
  }

  postMessage(): void {}

  terminate(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export default MockWorker;
