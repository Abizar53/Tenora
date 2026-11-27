


function validateProduct(product) {

    // Check whether request data is an object
    if (
        !product ||  //Checks whether product is missing or has a falsy value, such as null or undefined.
        typeof product !== "object" ||  // whether the received data is an object for ex: a string or number is not accepeted
        Array.isArray(product)    //Checks whether the received object is an array
    ) {
        return {
            valid: false,
            message: "Invalid product data."
        };
    }

    // Store only validated fields
    const updatedFields = {};  //store the fields that pass validation.

    // Fields allowed to be updated
    const allowedFields = [
        "name",
        "shortDescription",
        "description",
        "price",
        "currency",
        "imageUrl",
        "images",
        "category",
        "tags",
        "stock",
        "isAvailable",
        "weightGrams"
    ];

    // Validate normal product fields
    for (const field of allowedFields) {

        if (Object.hasOwn(product, field)) {    // checks whether the frontend actually sent that particular field

            const value = product[field];    // here field is property name and value is the actual data in that property

            // String validation
            if ([
                "name",
                "shortDescription",
                "description",
                "currency",
                "imageUrl",
                "category"
            ].includes(field)) {

                if (typeof value !== "string") {
                    return {
                        valid: false,
                        message: `Invalid ${field}.`
                    };
                }

                if (
                    ["name", "category", "description"].includes(field) &&     
                    value.trim() === ""   
                ) {
                    return {
                        valid: false,
                        message: `${field} cannot be empty.`
                    };
                }

                updatedFields[field] = value.trim();
            }

            // Number validation
            else if ([
                "price",
                "stock",
                "weightGrams"
            ].includes(field)) {

                if (
                    typeof value !== "number" ||
                    !Number.isFinite(value) ||
                    value < 0
                ) {
                    return {
                        valid: false,
                        message: `Invalid ${field}.`
                    };
                }

                if (field === "price" && value <= 0) {
                    return {
                        valid: false,
                        message: "Price must be greater than zero."
                    };
                }

                if (field === "stock" && !Number.isInteger(value)) {
                    return {
                        valid: false,
                        message: "Stock must be a whole number."
                    };
                }

                updatedFields[field] = value;
            }

            // Boolean validation
            else if (field === "isAvailable") {

                if (typeof value !== "boolean") {
                    return {
                        valid: false,
                        message: "Invalid availability status."
                    };
                }

                updatedFields[field] = value;
            }

            // Tags validation
            else if (field === "tags") {

                if (
                    !Array.isArray(value) ||
                    !value.every(tag => typeof tag === "string")
                ) {
                    return {
                        valid: false,
                        message: "Tags must be an array of strings."
                    };
                }

                updatedFields[field] = value
                    .map(tag => tag.trim())
                    .filter(tag => tag !== "");
            }
            
            // Images validation
            else if (field === "images") {

                if (
                    !Array.isArray(value) ||
                    value.length > 5 ||
                    !value.every(image =>
                        image &&
                        typeof image === "object" &&
                        typeof image.url === "string" &&
                        image.url.trim() !== "" &&
                        typeof image.publicId === "string" &&
                        image.publicId.trim() !== ""
                    )
                ) {
                    return {
                        valid: false,
                        message: "Invalid product images."
                    };
                }

    updatedFields.images = value.map(image => ({
        url: image.url.trim(),
        publicId: image.publicId.trim()
    }));
}
        }
    }

    // Validate dimensions
    if (Object.hasOwn(product, "dimensions")) {

        const dimensions = product.dimensions;

        if (
            !dimensions ||
            typeof dimensions !== "object" ||
            Array.isArray(dimensions)
        ) {
            return {
                valid: false,
                message: "Invalid dimensions."
            };
        }

        const allowedDimensions = [
            "widthMm",
            "heightMm",
            "depthMm"
        ];

        // Reject unknown dimension fields
        for (const dimension of Object.keys(dimensions)) {

            if (!allowedDimensions.includes(dimension)) {
                return {
                    valid: false,
                    message: "Invalid dimension field."
                };
            }
        }

        // Validate individual dimensions
        for (const dimension of allowedDimensions) {

            if (Object.hasOwn(dimensions, dimension)) {

                const value = dimensions[dimension];

                if (
                    typeof value !== "number" ||
                    !Number.isFinite(value) ||
                    value < 0
                ) {
                    return {
                        valid: false,
                        message: `Invalid ${dimension}.`
                    };
                }

                updatedFields[`dimensions.${dimension}`] = value;
            }
        }
    }

    // Check whether any valid fields were provided
    if (Object.keys(updatedFields).length === 0) {
        return {
            valid: false,
            message: "No valid fields provided."
        };
    }

    return {
        valid: true,
        updatedFields
    };
}

export default validateProduct;
