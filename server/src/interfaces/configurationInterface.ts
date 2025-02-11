export interface addConfigurationPayload {
    type: number,
    name: string,
    keys : keys
}

interface keys {
    apiToken:string,
    actorId:string,
    apiUrl:string,
}