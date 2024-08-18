export class EndOfLifePopup {
  private currentDate: Date;
  private monthlyThreshold: Date;
  private weeklyThreshold: Date;
  private preexistingPopupDate: Date | null;

  constructor(
    currentDate: Date,
    monthlyThreshold: Date,
    weeklyThreshold: Date
  ) {
    this.currentDate = currentDate;
    this.monthlyThreshold = monthlyThreshold;
    this.weeklyThreshold = weeklyThreshold;
    this.preexistingPopupDate = this.getLastPopupDateFromStorage();

    if (this.shouldShowPopup()) {
      this.showPopup();
    }
  }

  private getLastPopupDateFromStorage(): Date | null {
    const data = localStorage.getItem("LAST_POPUP");
    return data ? new Date(data) : null;
  }

  private shouldShowPopup(): boolean {
    if (!this.preexistingPopupDate) {
      return true;
    }

    const now = this.currentDate;
    const daysSinceLastPopup = this.calculateDaysSince(
      this.preexistingPopupDate,
      now
    );

    if (now > this.monthlyThreshold && daysSinceLastPopup >= 30) {
      return true;
    }
    if (now > this.weeklyThreshold && daysSinceLastPopup >= 7) {
      return true;
    }

    return false;
  }

  private calculateDaysSince(date1: Date, date2: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const timeDiff = date2.getTime() - date1.getTime();
    return Math.floor(timeDiff / millisecondsPerDay);
  }

  private showPopup(): void {
    alert(
      "End of Life notification: Your product is nearing its end of life. Please take the necessary actions."
    );
    localStorage.setItem("LAST_POPUP", this.currentDate.toISOString());
  }
}
