const addProduct = async (req, res, database) => {


    const { nombre, precio  } = req.body;



    if (!nombre|| !precio ) {
        return res.status(400).json("EMPTY_FIELDS");
    }


    const product = { nombre: nombre, precio: precio}

    const { MongoClient, url, dbName } = database;



    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    try {


        if (!client) {
            res.status(500).json("ERROR IN THE SERVER");
            return
        }

        const db = client.db(dbName);
        let collection = db.collection("products");

        let result = await insertproduct(product, collection);

        if (result) {
            res.status(200).json("PRODUCT_INSERTED");
        }

    } catch (err) {
        console.log(err);
        res.status(500).json("ERROR IN THE SERVER");

    } finally {
        client.close();
    }

}

async function insertproduct(product, collection) 
{

    const { nombre, precio } = product;

    try {
        
        let result = await collection.insertOne({ nombre: nombre, precio: precio });
        return result;
    }
    catch (err) {
        console.log(err)
    }

}


async function getProducts(req, res, database) {
    const { MongoClient, url, dbName } = database;

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    try {
        if (!client) {
            res.status(500).json("ERROR IN THE SERVER");
            return
        }

        const db = client.db(dbName);
        let collection = db.collection("products");

        const products = await collection.find({}).toArray();
        
        res.status(200).json(products);
        
    } catch (error) {
        console.log(error);
        res.status(500).json("ERROR IN THE SERVER");
    }finally{
        client.close();
    }


}


module.exports={
    addProduct:addProduct,
    getProducts:getProducts
}