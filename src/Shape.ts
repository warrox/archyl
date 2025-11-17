class Logger {
	log(message: string) {
		console.log(message);
	}
}

class Service {
	constructor(private logger: Logger) {}

	doWork() {
		this.logger.log("Working...");
	}
}
