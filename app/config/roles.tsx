export const roles = 
{
    admin: "admin",
    trainer: "trainer",
    guardian: "guardian",
    athlete: "athlete",
} as const;

export type Role = (typeof roles)[keyof typeof roles];