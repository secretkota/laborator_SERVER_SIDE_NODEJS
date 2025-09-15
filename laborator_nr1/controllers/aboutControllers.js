export const aboutText = (req, res) => {
    const text = "Это пример текста, который можно менять на лету!"
    
    res.render('about', { 
        text 
    })
};
