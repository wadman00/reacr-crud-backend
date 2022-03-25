const handleLogin = async (req, res, database, bcrypt) =>{
        var isFound = false;
        const { email, password } = req.body;
        const { MongoClient, url, dbName } = database;
        const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });
        try{

        if (!client) {
            res.status(500).json("ERROR IN THE SERVER");
            
            return
        }
        const db = client.db(dbName);
        let collection = db.collection("users");
        isFound = await checkUser(email,password,collection,bcrypt);

        if(isFound){
            res.json({status:"ACCESS_GRANTED",user:email})
        }else{
            res.json({status:"ACCESS_DENIED"});
        }
        
        
        }catch(err){
            console.log(err);
            res.status(500).json("ERROR IN THE SERVER");
        }finally{
        client.close();
        }
    
    }
    async function checkUser(email,password,collection,bcrypt){
    try {
        let query = { email:email};
        let result = await collection.findOne(query);
        let value = bcrypt.compareSync(password,result.password);
        if (value) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
    }
    module.exports = {
    handleLogin: handleLogin
    };