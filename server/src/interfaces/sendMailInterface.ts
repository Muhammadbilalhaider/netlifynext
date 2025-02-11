export interface mailOptionPayload {
    template_type: number,
    email: string,
    name: string,
    otp: number,
    id?: string,
};

export interface mailOptions {
    to: string,
    subject: string,
    template: string,
    context: any
};