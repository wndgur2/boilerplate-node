export abstract class BaseService {
  /**
   * Base service class for business logic
   * Extend this class to create specific services
   */
  protected logInfo(message: string): void {
    console.log(`[${this.constructor.name}] ${message}`);
  }

  protected logError(message: string, error?: Error): void {
    console.error(`[${this.constructor.name}] ${message}`, error);
  }
}
