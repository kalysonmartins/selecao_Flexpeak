<template>
<b-row class="vh-100 vw-100 row-login">
    <b-col sm="5" class="d-flex justify-content-center align-items-center  left-login">
        <div class="col-8">
            <h2 class="text-center mb-3 title-login">Faça seu login</h2>
            <b-form>
                <b-form-group label="E-mail" label-for="email">
                    <b-form-input id="email" type="email" placeholder="Ex: seuemail@email.com" autocomplete="off" v-model.trim="$v.form.email.$model" :state="getValidation('email')"></b-form-input>
                </b-form-group>

                <b-form-group label-for="password">
                    <label class="d-flex justify-content-between">
                        Senha
                        <small><a href="#">Esqueci a senha</a></small>
                    </label>
                    <b-form-input id="password" type="password" placeholder="Informe a sua senha" autocomplete="off" v-model.trim="$v.form.password.$model" :state="getValidation('password')"></b-form-input>
                </b-form-group>

                <b-button class="btn mt-2" type="button" variant="primary" block @click="login">Acessar conta
                </b-button>
                <hr>

                <b-button type="button" variant="outline-secondary" block @click="register">Cria conta
                </b-button>

            </b-form>
        </div>
    </b-col>
    <b-col sm="7" class="d-flex justify-content-center align-items-center">
        <img src="../assets/imagem/login-gif.gif" width="70%">
    </b-col>
</b-row>
</template>

<script>
import {
    required,
    minLength,
    email
} from "vuelidate/lib/validators";
import UsersModel from "@/models/UsersModel";
import ToastMixin from "@/mixins/toastMixin.js";

export default {
    mixins: [ToastMixin],
    data() {
        return {
            form: {
                email: "",
                password: ""
            }
        }
    },

    validations: {
        form: {
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(6)
            }
        }
    },

    methods: {
        async login() {
            this.$v.$touch();
            if (this.$v.$error) {
                return;
            }

            let user = await UsersModel.params({
                email: this.form.email
            }).get();

            if (!user || !user[0] || !user[0].email) {
                this.showToast("danger", "Erro!", "Usuário ou senha incorretos");
                this.clearForm();
                return;
            }

            user = user[0];
            if (user.password !== this.form.password) {
                this.showToast("danger", "Erro!", "Usuário ou senha incorretos");
                this.clearForm();
                return;
            }

            localStorage.setItem('authUser', JSON.stringify(user));
            this.$router.push({name: 'list'});

        },

        clearForm() {
            this.form = {
                email: "",
                password: ""
            }

        },

        register() {
            this.$router.push({
                name: 'register'
            })
        },

        getValidation(field) {
            if (this.$v.form.$dirty === false) {
                return null;
            }
            return !this.$v.form[field].$error;
        }
    }
}
</script>

<style>
*,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;

}

.row-login {
    margin-left: 0;
}

.left-login {
    background: #f2f2f2;
}

.btn {
    width: 100%;
}

.title-login {
    font-weight: bold;
}
</style>
