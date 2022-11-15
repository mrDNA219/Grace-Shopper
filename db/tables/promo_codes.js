const client = require('../client');

async function createPromoCode({ productId, code, flatDiscount, percentDiscount }) {
    try {
        const { rows: [promo_code] } = await client.query(`
            INSERT INTO promo_codes("productId", code, "flatDiscount", "percentDiscount")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `, [productId, code, flatDiscount, percentDiscount]);

            return promo_code;

    } catch (error) {
        console.error('Error creating promo code');
        throw error;
    }
};

async function getAllPromoCodes(id) {
    try {
        const {rows: [promo_codes]} = await client.query(`
        SELECT *
        FROM promo_codes
        WHERE id=$1;
        `, [id]);

        return promo_codes;
    } catch (error) {
        console.error("Error getting all promo codes");
        throw error;
    }
};

async function updatePromoCode({id, ...fields}) {
    const { update } = fields;

    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

    try {
        if(setString.length > 0){
            await client.query(`
            UPDATE promo_codes
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
            `, Object.values(fields));
        }
        if(update === undefined){
            return await getAllPromoCodes(id);
        }
    } catch (error) {
        console.error('Error updating promo code');
        throw error;
    }
};

async function deletePromoCode(id) {
    try {
        const { rows: deletedPromoCode } = await client.query(`
            DELETE FROM promo_codes
            WHERE id=$1
            RETURNING *;
        `, [id]);

        return deletedPromoCode;

    } catch (error) {
        console.error('Error deleting promo code');
        throw error;
    }
};

async function getPromoCodesByProductId(productId){
    try {
        const {rows: promo_codes } = await client.query(`
        SELECT *
        FROM promo_codes
        WHERE "productId"=$1
        `, [productId]);

        promo_codes.forEach((promo_code) => {
            delete promo_code.productId
        });

        return promo_codes;

    } catch (error) {
        console.error('Error getting promo codes by productId');
        throw error;
    }
}

module.exports = {
    createPromoCode,
    getAllPromoCodes,
    updatePromoCode,
    deletePromoCode,
    getPromoCodesByProductId
};
