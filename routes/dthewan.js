const express = require('express');
const router = express.Router();

let datahewan = [];

// endpoint untuk mendapatkan data Todos
router.get('/', (req, res) => {res.json(datahewan); });

router.post('/', (req, res)=> {
    const newdthewan = {
        id: datahewan.length + 1,
        namahewan: req.body.namahewan,
        kelas: req.body.kelas
        };
        datahewan.push(newdthewan);
        res.status(201).json(newdthewan);
})
module.exports = router;

router.delete('/:id',(req, res)=> {
    const dthewanIndex = datahewan.findIndex(t => t.id === parseInt(req.params.id));
    if(dthewanIndex === -1) return res.status(404).json({message: 'Data hewan tidak ditemukan'});

    const deletedDthewan = datahewan.splice(dthewanIndex, 1)[0];
    res.status(200).json({message: `Data hewan'${deletedDthewan.task} 'Telah dihapus`});
});

router.put('/:id', (req, res)=> {
    const dthewan = datahewan.find(t => t.id === parseInt(req.params.id));
    if(!dthewan) return res.status(404).json({message: 'Data hewan tidak ditemukan'});
    dthewan.namahewan = req.body.namahewan || dthewan.namahewan;

    res.status(200).json({
        message: `Data hewan dengan id ${dthewan.id}' telah diperbarui`,
        updatedDthewan: dthewan
    });
});