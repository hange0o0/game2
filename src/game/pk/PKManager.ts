class PKManager {
    private static instance:PKManager;

    public static getInstance() {
        if (!this.instance) this.instance = new PKManager();
        return this.instance;
    }
}