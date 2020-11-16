# padrão
{
  "rules": {
    ".read": "false", 
    ".write": "false", 
  }
}

# público

{
  "rules": {
    ".read": "true", 
    ".write": "true", 
  }
}

# usuários autenticados

{
  "rules": {
    ".read": "auth != null", 
    ".write": "auth != null"
  }
}

# Acesso restrito ao dono dos dados

{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid == auth.uid", 
    	".write": "$uid == auth.uid"
      }
    }
  }
}

# Validação de dados

{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid == auth.uid", 
    		".write": "$uid == auth.uid",
          "$tid": {
           ".validate": "newData.child('name').isString() && newData.child('name').val().length <= 30"
          }
      }
    }
  }
}