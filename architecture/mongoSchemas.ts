export const gigsSchema = {
    bsonType: "object",
    required:
        ["type", "org", "startDate", "endDate", "location", "fee", "rehearsals"],
    properties:
        {
            type: {
                enum:
                    ["Rehearsal", "concert", "tuition", "other", null],
                description:
                    "Can only be one of the enum values and is required"
            },
            org: {
                bsonType: "object",
                required: ["name", "fixer"],
                properties:
                    {
                        name: {
                            bsonType: "string",
                        },
                        fixer: {
                            bsonType: "object",
                            properties: {
                                firstName: {
                                    bsonType: "string",
                                },
                                lastName: {
                                    bsonType: "string",
                                },
                                phoneNumber: {
                                    bsonType: "string",
                                    description:
                                        "Telephone number"
                                },
                                email: {
                                    bsonType: "string",
                                    description:
                                        "Telephone number"
                                },
                            },
                        },
                        treasurer: {
                            bsonType: "object",
                            properties: {
                                firstName: {
                                    bsonType: "string",
                                },
                                lastName: {
                                    bsonType: "string",
                                },
                                phoneNumber: {
                                    bsonType: "string",
                                    description:
                                        "Telephone number"
                                },
                                email: {
                                    bsonType: "string",
                                    description:
                                        "Telephone number"
                                },
                            },
                        },
                    },
            },
            startDate: {
                bsonType: "date",
                description: "Date and time"
            },
            endDate: {
                bsonType: "date",
                description: "Date and time"
            },
            location: {
                bsonType: "object",
                required:
                    ["name", "postcode"],
                properties:
                    {
                        name: {
                            bsonType: "string",
                        },
                        street: {
                            bsonType: "string",
                            description:
                                "Number and street name."
                        },
                        postcode: {
                            bsonType: "string",
                            description:
                                "Postcode (UK or foreign)."
                        },
                        parkingInfo: {
                            bsonType: "string",
                            description:
                                "Parking info for the venue."
                        },
                        accessInfo: {
                            bsonType: "string",
                            description:
                                "Any gate code or other instructions to access."
                        }
                    }
            },
            dressCode: {
                bsonType: "string"
            },
            fee: {
                bsonType: "object",
                properties: {
                    required: ["currencySymbol", "amount"],
                    currencySymbol: {
                        bsonType: "string",
                        description: "A currency symbol such as £"
                    },
                    amount: {
                        bsonType: "decimal",
                    }
                }
            }
        }
};
