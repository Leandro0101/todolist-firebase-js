todoForm.onsubmit = function (event) {
    event.preventDefault()

    if (todoForm.name.value != '') {
        let data = {
            name: todoForm.name.value
        }

        dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(function () {
            console.log(`Tarefa ${data.name} adicionada com sucesso`);
        }).catch(function (error) {
            showError('Falha ao adicionar tarefa', error)
        })
    } else {
        alert('O nome da tarefa não pode estar vazio')
    }
}

//Exibir lista de tarefas de cada usuário

function fillTodoList(dataSnapshot) {
    ulTodoList.innerHTML = ''
    const num = dataSnapshot.numChildren()
    todoCount.innerHTML = `${num} tarefas:`
    dataSnapshot.forEach(function (item) {
        let li = document.createElement('li')
        let spanLi = document.createElement('span')
        spanLi.appendChild(document.createTextNode(item.val().name))
        spanLi.id = item.key
        li.appendChild(spanLi)
        let liRemoveBtn = document.createElement('button')
        liRemoveBtn.appendChild(document.createTextNode('Excluir'))
        liRemoveBtn.setAttribute('onclick', `removeTodo('${item.key}')`)
        liRemoveBtn.setAttribute('class', 'danger todoBtn')
        li.appendChild(liRemoveBtn)
        ulTodoList.appendChild(li)
    })
}

//remove tarefas do banco de dados

function removeTodo(key) {
    const selectedItem = document.getElementById(key)
    const confirmation = confirm(`Realmente deseja remover a tarefa "${selectedItem.innerHTML}"?`)

    if(confirmation){
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove().catch(function(error){
            showError('Falha ao remover tarefa', error);
        })
    }
}