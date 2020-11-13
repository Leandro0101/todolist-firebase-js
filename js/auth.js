firebase.auth().languageCode = 'pt-BR'
authForm.onsubmit = function (event) {
    showItem(loading)
    event.preventDefault()
    if (authForm.submitAuthForm.innerHTML == 'Acessar') {
        firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
            showError('Falha no acesso', error)
        })
    } else {
        firebase.auth().createUserWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
            showError('Falha no acesso', error)
        })
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    hideItem(loading)
    if (user) {
        showUserContent(user)
    } else {
        showAuth()
    }
})
// Permite o user a sair da conta dele
function signOut() {
    firebase.auth().signOut().catch(function (error) {
        showError('Falha no logout', error)
    })
}

function sendEmailVerification() {
    showItem(loading)
    const user = firebase.auth().currentUser
    user.sendEmailVerification(actionCodeSettings).then(function () {
        alert(`email de verificação foi enviado para ${user.email}! Acesse a sua caixa de entrada`)
    }).catch(function (error) {
        showError('Falha no envio do email de verificação ', error)
    }).finally(function () {
        hideItem(loading)
    })
}

//função que permite o usuário redefinir a sua senha
function sendPasswordResetEmail() {
    const email = prompt('Redefinir senha! Informe o seu endereço de email', authForm.email.value)
    if (email) {
        showItem(loading)
        firebase.auth().sendPasswordResetEmail(email, actionCodeSettings).then(function () {
            alert(`Email de redefinição de senha foi enviado para${email}`)
        }).catch(function (error) {
            showError('Falha no envio do email de redefinição de senha', error)
        }).finally(function () {
            hideItem(loading)
        })
    } else {
        alert('É preciso preencher o campo de email para redefinir a senha')
    }
}

//Função que permite autenticação pelo google

function signInWithGoogle() {
    showItem(loading)
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (error) {
        showError('Falha na autenticação com google ', error)
        hideItem(loading)
    })
}

//Função que permite autenticação pelo github

function signInWithGithub() {
    showItem(loading)
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch(function (error) {
        alert('Houve um erro ao autenticar usando o github')
        showError('Falha na autenticação com github ', error)
        hideItem(loading)
    })
}
function signInWithFacebook() {
    showItem(loading)
    firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider()).catch(function (error) {
        showError('Falha na autenticação com facebook ', error)
        hideItem(loading)
    })
}

//Função que permite atualizar nome do usuário
function updateUserName() {
    let newUserName = prompt("Informe um novo nome de usuário", userName.innerHTML)

    if (newUserName && newUserName != '') {
        userName.innerHTML = newUserName
        showItem(loading)
        firebase.auth().currentUser.updateProfile({
            displayName: newUserName
        }).catch(function (error) {
            showError('Falha na atualização de usuário ', error)
        }).finally(function () {
            hideItem(loading)
        })
    } else {
        alert('Nome de usuário não ser vazio')
    }
}

function deleteUserAccount() {
    const confirmation = confirm('Realmente deseja excluir sua conta?')

    if (confirmation) {
        showItem(loading)
        firebase.auth().currentUser.delete().then(function () {
            alert('Conta excluída com sucesso')
        }).catch(function (error) {
            showError('Falha ao remover sua conta ', error)
        }).finally(function () {
            hideItem(loading)
        })
    }
}

