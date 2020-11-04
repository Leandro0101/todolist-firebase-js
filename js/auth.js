firebase.auth().languageCode = 'pt-BR'
authForm.onsubmit = function (event) {
    showItem(loading)
    event.preventDefault()
    if (authForm.submitAuthForm.innerHTML == 'Acessar') {
        firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
            console.log('Falha no acesso')
            console.log(error)
            hideItem(loading)
        })
    } else {
        firebase.auth().createUserWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
            console.log('Falha no cadastro')
            console.log(error)
            hideItem(loading)
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
        console.log('Falha ao sair da conta')
        console.log(error)
    })
}

function sendEmailVerification() {
    showItem(loading)
    const user = firebase.auth().currentUser
    user.sendEmailVerification(actionCodeSettings).then(function () {
        alert(`email de verificação foi enviado para ${user.email}! Acesse a sua caixa de entrada`)
    }).catch(function (error) {
        alert('Houve uma erro ao enviar o email de verificação')
        console.log(error)
    }).finally(function(){
        hideItem(loading)
    })
}


