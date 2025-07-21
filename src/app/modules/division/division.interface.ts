export interface IDivision {
    name: string;
    slug: string;
    thumbnail ?: string;
    description ?: string;
}

/**
 * division = Dhaka Division
 * slug --> dhaka-division
 * /:id --> /:slug (/division/dhaka-division)
 */