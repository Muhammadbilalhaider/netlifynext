export interface getCategoryPayload {
    name: string,
    type: string,
    _id: string,
    page?: number,
    limit?: string,
    search?: string
}

export interface addCategoryPayload {
    name: string,
}

export interface editCategoryPayload {
    _id: string,
    name: string,
}