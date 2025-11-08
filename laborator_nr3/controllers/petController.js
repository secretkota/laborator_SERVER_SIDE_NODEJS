import * as Pet from "../model/petModel.js"

export const getCategory = async (req, res) => {
    try {
        const categories = await Pet.getCategories()
        if (!categories) return res.status(404).json({ message: "Категории не найдены"})
        res.json(categories)
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

export const getAll = async (req, res) => {
    try {
        const pets = await Pet.getAll()
        if (!pets) return res.status(404).json({ message: "Питомецы не найдены"})
        res.json(pets)
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

export const getByID = async (req, res) => {
    const petID = req.params.id;

    try {
        const pet = await Pet.getByID(petID)
        if (!pet) return res.status(404).json({ message: "Питомец не найден"})
        res.json(pet)
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

export const create = async (req, res) => {
    const { owner_id, name, type, age, photo_path, desc } = req.body

    if (!name) return res.status(400).json({ error: "Имя питомца обязательно" })
    if (!type) return res.status(400).json({ error: "Выберите тип питомца" })
    if (age < 0) return res.status(400).json({ error: "Возраст не может быть отрицательным" })


    try {
        const pet = await Pet.create({ owner_id, name, type, age, photo_path, desc })
        if (!pet) return res.status(500).json({ error: "Ошибка при создании питомца" })
        res.status(201).json({ message: "Питомец успешно создан", petId: pet.id })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

export const deletePet = (req, res) => {
    const petID = req.params.id;
    const userID = req.user.id;

    deletePet(petID, userID, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.changes === 0) return res.status(404).json({ error: "Питомец не найден" });
        res.json({ success: true });
    });
};
