export interface getTechnologyPayload {
    name: string,
    type: string,
    _id: string,
    page: number,
    limit: string,
    search: string
}

export interface addTechnologyPayload {
    name: string,
}