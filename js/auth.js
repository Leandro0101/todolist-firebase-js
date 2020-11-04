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

//função que permite o usuário redefinir a sua senha
function sendPasswordResetEmail(){
    const email = prompt('Redefinir senha! Informe o seu endereço de email', authForm.email.value)
    if(email){
        showItem(loading)
        firebase.auth().sendPasswordResetEmail(email, actionCodeSettings).then(function (){
            alert(`Email de redefinição de senha foi enviado para${email}`)
        }).catch(function (error) {
            alert('Houve um erro ao enviar email de redefinição de senha')
            console.log(error)
        }).finally(function (){
            hideItem(loading)
        })
    }else{
        alert('É preciso preencher o campo de email para redefinir a senha')
    }
}

//Função que permite autenticação pelo google

function signInWithGoogle(){
    showItem(loading)
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (error){
        alert('Houve um erro ao autenticar usando o google')
        console.log(error)
        hideItem(loading)
    })
}

//Função que permite autenticação pelo github

function signInWithGithub(){
    showItem(loading)
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch(function (error){
        alert('Houve um erro ao autenticar usando o github')
        console.log(error)
        hideItem(loading)
    })
}

