// Defindo referências para elementos da página
const authForm = document.getElementById('authForm')
const authFormTitle = document.getElementById('authFormTitle')
const register = document.getElementById('register')
const access = document.getElementById('access')
const loading = document.getElementById('loading')
const auth = document.getElementById('auth')
const userContent = document.getElementById('userContent')
const userEmail = document.getElementById('userEmail')
const sendEmailVerificationDiv = document.getElementById('sendEmailVerificationDiv')
const emailVerified = document.getElementById('emailVerified')
const passwordReset = document.getElementById('passwordReset')
const userImg = document.getElementById('userImg')
const userName = document.getElementById('userName')

const todoForm = document.getElementById('todoForm')
const todoCount = document.getElementById('todoCount')
const ulTodoList = document.getElementById('ulTodoList')

const search = document.getElementById('search')

// Alterar o formulário de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = 'Cadastrar conta'
  authFormTitle.innerHTML = 'Insira seus dados para se cadastrar'
  hideItem(register)
  showItem(access)
  hideItem(passwordReset)
}

// Alterar o formulário de autenticação para o acesso de contas já existentes
function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = 'Acessar'
  authFormTitle.innerHTML = 'Acesse a sua conta para continuar'
  hideItem(access)
  showItem(register)
  showItem(passwordReset)
}

// Simpplifica a exibição de elementos da página
function showItem(element) {
  element.style.display = 'block'
}

// Simpplifica a remoção de elementos da página
function hideItem(element) {
  element.style.display = 'none'
}

function showUserContent(user) {
  console.log(user)
  if (user.providerData[0].providerId != 'password') {
    emailVerified.innerHTML = 'Autenticação por provedor confiável não é necessário verificar email'
    hideItem(sendEmailVerificationDiv)
  } else {
    if (user.emailVerified) {
      emailVerified.innerHTML = 'Email verificado'
      hideItem(sendEmailVerificationDiv)
    } else {
      emailVerified.innerHTML = 'Email não verificado'
      showItem(sendEmailVerificationDiv)
    }

  }

  userImg.src = user.photoURL ? user.photoURL : 'img/unknownUser.png'
  userName.innerHTML = user.displayName ? user.displayName : ''
  userEmail.innerHTML = user.email
  hideItem(auth)

  getDefaultTodoList()
  search.onkeyup = function () {
    if(search.value != ''){
      dbRefUsers.child(user.uid).orderByChild('name').startAt(search.value).endAt(`${search.value}\uf8ff`).once('value').then(function (dataSnapshot){
        fillTodoList(dataSnapshot)
      })
    }else{
      getDefaultTodoList()
    }
  }

  showItem(userContent)
}

//Busca de tarefas em tempo real(listagem padrão)

function getDefaultTodoList() {
  dbRefUsers.child(firebase.auth().currentUser.uid).orderByChild('name').on('value', function(dataSnapshot){
    fillTodoList(dataSnapshot)
  })
}

function showAuth() {
  authForm.email.value = ''
  authForm.password.value = ''
  hideItem(userContent)
  showItem(auth)
}

// centralizar e traduzir erros

function showError(prefix, error){
  console.log(error.code)
  hideItem(loading)

  switch(error.code) {
    case 'auth/invalid-email':

    case 'auth/wrong-password': alert(`${prefix}: Email ou senha inválidos`)
    break;

    case 'auth/weak-password': alert(`${prefix}: senha fraca`)
    break;

    case 'auth/email-already-in-use': alert(`${prefix}: email já cadastrado`)
    break;

    case 'auth/popup-closed-by-user': alert(`${prefix}: o popup de autenticação foi fechado antes da operação ser concluída`)
    break;

    default: alert(`${prefix} ${error.message}`)
  }
}

//Atributos extras de configuração de email

const actionCodeSettings = {
  url: 'https://todolist-ee054.firebaseapp.com'
}

const database = firebase.database()
const dbRefUsers = database.ref('users')