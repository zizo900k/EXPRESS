import mongoose from "mongoose";    
const ProduitSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.Int32,
    name: mongoose.Schema.Types.String,
    price: mongoose.Schema.Types.Number,
    quantity: mongoose.Schema.Types.Number,
    description: mongoose.Schema.Types.String,
    category: mongoose.Schema.Types.String,
});
export const ProduitModel = mongoose.model("Produits", ProduitSchema);