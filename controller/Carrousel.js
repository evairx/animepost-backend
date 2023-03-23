import CarrouselModel from '../models/Carrousel.js';

const getCarrousel = (req, res) =>{
    CarrouselModel.find()
     .then((data) => res.status(200).json(data))
     .catch(() => res.status(400).json({ message: "Bad Request"}));
};

const addCarrousel = async (req, res) => {
    try {
        const { body } = req;
        const carrousel = await CarrouselModel.create(body);
        if (!carrousel) {
            throw new Error("El Carrousel no pudo ser creado!");
        };
        res.status(200).json("El Carrousel  ha sido creado exitosamente!");
    } catch (error) {
        res.status(500).json(error);
    };
  };

const CarrouselExports = {
    getCarrousel,
    addCarrousel,
}

export default CarrouselExports;