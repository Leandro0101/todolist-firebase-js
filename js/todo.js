todoForm.onsubmit = event => {
    event.preventDefault()

    if (todoForm.name.value != '') {
        const file = todoForm.file.files[0]
        if (file != null) {
            if (file.type.includes('image')) {
                const imgName = `${firebase.database().ref().push().key}-${file.name}`
                const imgPath = `todoListFiles/${firebase.auth().currentUser.uid}/${imgName}`

                const storageRef = firebase.storage().ref(imgPath)
                const upload = storageRef.put(file)


                trackUpload(upload).then(() => {
                    storageRef.getDownloadURL(upload).then(downloadURL => {
                        const data = {
                            imgUrl: downloadURL,
                            name: todoForm.name.value
                        }

                        dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(() => {
                            console.log(`Tarefa ${data.name} adicionada com sucesso`);
                        }).catch(error => {
                            showError('Falha ao adicionar tarefa', error)
                        })

                        todoForm.name.value = ''
                        todoForm.file.value = ''

                    })

                }).catch(error => {
                    showError('Falha ao adicionar tarefa', error)
                })
            } else {
                alert('O arquivo selecionado precisa ser uma imagem, tente novamente')
            }
        } else {
            const data = {
                name: todoForm.name.value
            }

            dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(() => {
                console.log(`Tarefa ${data.name} adicionada com sucesso`);
            }).catch(error => {
                showError('Falha ao adicionar tarefa', error)
            })

            todoForm.name.value = ''
        }
    } else {
        alert('O nome da tarefa não pode estar vazio')
    }
}

function trackUpload(upload) {
    return new Promise((resolve, reject) => {
        showItem(progressFeedback)
        upload.on('state_changed',
            snapshot => {
                console.log(snapshot)
                progress.value = snapshot.bytesTransferred / snapshot.totalBytes * 100
            }, error => {
                hideItem(progressFeedback)
                reject(error)
            }, () => {
                console.log('Sucesso no upload!')
                hideItem(progressFeedback)
                resolve()
            })

        let playPauseUpload = true
        playPauseBtn.onclick = () => {
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

        cancelBtn.onclick = () => {
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
    dataSnapshot.forEach(item => {
        const li = document.createElement('li')
        li.id = item.key
        const imgLi = document.createElement('img')
        imgLi.src = item.val().imgUrl ? item.val().imgUrl : 'img/defaultTodo.png'
        imgLi.setAttribute('class', 'imgTodo')
        li.appendChild(imgLi)

        const spanLi = document.createElement('span')
        spanLi.appendChild(document.createTextNode(item.val().name))



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
    const todoName = document.querySelector(`#${key} > span`)
    const todoImg = document.querySelector(`#${key} > img`)

    const confirmation = confirm(`Realmente deseja remover a tarefa "${todoName.innerHTML}"?`)

    if (confirmation) {
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove().then(() => {
            console.log(`Tarefa ${todoName.innerHTML} removida com sucesso`);
            removeFile(todoImg.src)
        }).catch(error => {
            showError('Falha ao remover tarefa', error)
        })
    }
}


//Remove imagem de acordo com a tarefa removida
function removeFile(imgUrl) {
    console.log(imgUrl)

    const result = imgUrl.indexOf('img/defaultTodo.png')

    if (result === -1) {
        firebase.storage().refFromURL(imgUrl).delete().then(() => {
            console.log('Arquivo removido com sucesso')
        }).catch(error => {
            console.log('Falha ao remover arquivo')
            console.log(error)
        })
    } else {
        console.log('Nenhum arquivo removido')
    }
}

let updateTodoKey = null

function updateTodo(key) {
    updateTodoKey = key
    const todoName = document.querySelector(`#${key} > span`)
    //Altera o título do formulário de tarefas
    todoFormTitle.innerHTML = `<strong>Editar a tarefa: ${todoName.innerHTML} </strong>`
    //Altera o texto da entrada de nome
    todoForm.name.value = todoName.innerHTML
    hideItem(submitTodoForm)
    showItem(cancelupdateTodo)

}

function resetTodoForm() {
    todoFormTitle.innerHTML = 'Adicionar tarefa'
    hideItem(cancelupdateTodo)
    submitTodoForm.style.display = 'initial'
    todoForm.name.value = ''
    todoForm.file.value = ''
}

function confirmUpdateTodo() {
    hideItem(cancelupdateTodo)

    if (todoForm.name.value !== '') {
        const todoImg = document.querySelector(`#${updateTodoKey} > img`)
        const file = todoForm.file.files[0]
        if (file != null) {
            if (file.type.includes('image')) {
                const imgName = `${firebase.database().ref().push().updateTodoKey}-${file.name}`
                const imgPath = `todoListFiles/${firebase.auth().currentUser.uid}/${imgName}`

                const storageRef = firebase.storage().ref(imgPath)
                const upload = storageRef.put(file)

                trackUpload(upload).then(() => {
                    storageRef.getDownloadURL().then((downloadURL) => {
                        const data = {
                            imgUrl: downloadURL,
                            name: todoForm.name.value
                        }

                        dbRefUsers.child(firebase.auth().currentUser.uid).child(updateTodoKey).update(data).then(() => {
                            console.log(`Tarefa ${data.name} atualizada com sucesso`);
                        }).catch(error => {
                            showError('Falha ao atualizar tarefa', error)
                        })
                        
                        removeFile(todoImg.src)
                        resetTodoForm()
                    }).catch(error => {
                        showError('Falha ao atualizar tarefa ', error)
                    })
                })
            } else {
                alert('O arquivo selecionado precisa ser uma imagem')
            }
        } else {
            const data = {
                name: todoForm.name.value
            }

            dbRefUsers.child(firebase.auth().currentUser.uid).child(updateTodoKey).update(data).then(() => {
                console.log(`Tarefa ${data.name} atualizada com sucesso`);
            }).catch(error => {
                showError('Falha ao atualizar tarefa', error)
            })
        }
    } else {
        alert('O nome da tarefa não pode estar vazio')
    }
}
//update tarefas do banco de dados a
function updateTodo2(key) {
    const selectedItem = document.getElementById(key)
    const newTodoName = prompt(`Escolha um novo nome para a tarefa ${selectedItem.children[1].innerHTML}`, selectedItem.children[1].innerHTML)

    if (newTodoName != '') {
        const data = {
            name: newTodoName,
        }

        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data).then(() => {
            console.log(`Tarefa ${data.name} atualizada com sucesso`);
        }).catch(error => {
            showError('Falha ao atualizar tarefa', error)
        })

    } else {
        alert('O nome da tarefa não pode ficar em branco')
    }
}
