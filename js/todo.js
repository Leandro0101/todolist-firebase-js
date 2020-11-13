todoForm.onsubmit = function(event) {
    event.preventDefault()

    if(todoForm.name.value != '') {
        let data = {
            name: todoForm.name.value
        }

        dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(function(){
            console.log(`Tarefa ${data.name} adicionada com sucesso`);
        })
    }else{
        alert('O nome da tarefa não pode estar vazio')
    }
}