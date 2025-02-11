export interface getCompanyPayload {
    name: string,
    type: string,
    _id: string,
    page: number,
    limit: string,
    search: string
}

export interface addCompanyPayload {
    name: string,
}