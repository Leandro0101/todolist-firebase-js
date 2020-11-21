todoForm.onsubmit = function (event) {
    event.preventDefault()

    if (todoForm.name.value != '') {
        const file = todoForm.file.files[0]
        if (file != null) {
            if (file.type.includes('image')) {
                const imgName = `${firebase.database().ref().push().key}-${file.name}`
                const imgPath = `todoListFiles/${firebase.auth().currentUser.uid}/${imgName}`

                const storageRef = firebase.storage().ref(imgPath)
                const upload = storageRef.put(file)


                trackUpload(upload).then(function () {
                    storageRef.getDownloadURL(upload).then(function (downloadURL) {
                        const data = {
                            imgUrl: downloadURL,
                            name: todoForm.name.value
                        }

                        dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(function () {
                            console.log(`Tarefa ${data.name} adicionada com sucesso`);
                        }).catch(function (error) {
                            showError('Falha ao adicionar tarefa', error)

                        })

                        todoForm.name.value = ''
                        todoForm.file.value = ''

                    })

                }).catch(function (error) {
                    showError('Falha ao adicionar tarefa', error)
                })
            } else {
                alert('O arquivo selecionado precisa ser uma imagem, tente novamente')
            }
        } else {
            const data = {
                name: todoForm.name.value
            }

            dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(function () {
                console.log(`Tarefa ${data.name} adicionada com sucesso`);
            }).catch(function (error) {
                showError('Falha ao adicionar tarefa', error)
            })

            todoForm.name.value = ''
        }
    } else {
        alert('O nome da tarefa não pode estar vazio')
    }
}

function trackUpload(upload) {
    return new Promise(function (resolve, reject) {
        showItem(progressFeedback)
        upload.on('state_changed',
            function (snapshot) {
                console.log(snapshot)
                progress.value = snapshot.bytesTransferred / snapshot.totalBytes * 100
            }, function (error) {
                hideItem(progressFeedback)
                reject(error)
            }, function () {
                console.log('Sucesso no upload!')
                hideItem(progressFeedback)
                resolve()
            })

        let playPauseUpload = true
        playPauseBtn.onclick = function () {
            playPauseUpload = !playPauseUpload

            if (playPauseUpload) {
                upload.resume()

                playPauseBtn.innerHTML = 'Pausar'
                console.log('Upload foi retomado')
            } else {
                upload.pause()
                playPauseBtn.innerHTML = 'Continuar'
                console.log('Upload foi pausado')
            }
        }

        cancelBtn.onclick = function () {
            upload.cancel()
            todoForm.file.value = ''
            hideItem(cancelBtn)
        }
    })

}

//Exibir lista de tarefas de cada usuário

function fillTodoList(dataSnapshot) {
    ulTodoList.innerHTML = ''
    const num = dataSnapshot.numChildren()
    todoCount.innerHTML = `${num} tarefas:`
    dataSnapshot.forEach(function (item) {
        const li = document.createElement('li')

        const imgLi = document.createElement('img')
        imgLi.src = item.val().imgUrl ? item.val().imgUrl : 'img/defaultTodo.png'
        imgLi.setAttribute('class', 'imgTodo')
        li.appendChild(imgLi)

        const spanLi = document.createElement('span')
        spanLi.appendChild(document.createTextNode(item.val().name))
        spanLi.id = item.key
        li.appendChild(spanLi)
        const liRemoveBtn = document.createElement('button')
        liRemoveBtn.appendChild(document.createTextNode('Excluir'))
        liRemoveBtn.setAttribute('onclick', `removeTodo('${item.key}')`)
        liRemoveBtn.setAttribute('class', 'danger todoBtn')
        li.appendChild(liRemoveBtn)

        const liUpdateBtn = document.createElement('button')
        liUpdateBtn.appendChild(document.createTextNode('Atualizar'))
        liUpdateBtn.setAttribute('onclick', `updateTodo('${item.key}')`)
        liUpdateBtn.setAttribute('class', 'alternative todoBtn')
        li.appendChild(liUpdateBtn)

        ulTodoList.appendChild(li)
    })
}

//remove tarefas do banco de dados

function removeTodo(key) {
    const selectedItem = document.getElementById(key)
    const confirmation = confirm(`Realmente deseja remover a tarefa "${selectedItem.innerHTML}"?`)

    if (confirmation) {
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove().then(function () {
            console.log(`Tarefa ${selectedItem.innerHTML} removida com sucesso`);
        }).catch(function (error) {
            showError('Falha ao remover tarefa', error);
        })
    }
}

//update tarefas do banco de dados a
function updateTodo(key) {
    const selectedItem = document.getElementById(key);
    const newTodoName = prompt(`Escolha um novo nome para a tarefa ${selectedItem.innerHTML}`, selectedItem.innerHTML);

    if (newTodoName != '') {
        const data = {
            name: newTodoName,
        }

        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data).then(function () {
            console.log(`Tarefa ${data.name} atualizada com sucesso`);
        }).catch(function (error) {
            showError('Falha ao atualizar tarefa', error)
        })

    } else {
        alert('O nome da tarefa não pode ficar em branco')
    }
}