export const sqlQueries = {
    select_all_clubs: `SELECT * FROM clubs`,
    insert_club: `INSERT INTO clubs (name, chairman) VALUES($name, $chairman)`,
    delete_club: `DELETE FROM clubs WHERE id = $id`,

    select_all_products: `SELECT * FROM products`,
    insert_product: `INSERT INTO products (name, price) VALUES($name, $price)`,
    delete_product: `DELETE FROM products WHERE id = $id`,

    select_all_discounts: `SELECT * FROM discounts`,
    select_discounts_by_product_id: `SELECT * FROM discounts WHERE product_id = $product_id`,
    insert_discount: `INSERT INTO discounts ([from], [to], percent, product_id) VALUES($from, $to, $percent, $product_id)`,
    delete_discount: `DELETE FROM discounts WHERE id = $id`,
    delete_discounts_by_product_id: `DELETE FROM discounts WHERE product_id = $product_id`,

    select_purchases_by_club_id: `SELECT id, club_id, product_id, SUM(quantity) AS quantity, date FROM purchases WHERE club_id = $club_id GROUP BY product_id`,
    select_purchases: `SELECT id, club_id, product_id, quantity, date FROM purchases`,
    select_purchases_by_date_range: `SELECT id, club_id, product_id, quantity, date FROM purchases WHERE strftime('%s', date) > strftime('%s', $from_date) AND strftime('%s', date) <= strftime('%s', $to_date)`,
    insert_purchase: `INSERT INTO purchases (club_id, product_id, quantity, date) VALUES($club_id, $product_id, $quantity, $date)`,
    delete_purchase: `DELETE FROM purchases WHERE id = $id`

}
