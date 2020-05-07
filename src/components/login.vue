<template>
    <div class="container mt-5">
        <div class="card mt-5">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <h3>{{auth?'Авторизация':'Регистрация'}}</h3>
                    <div
                        class="btn btn-info"
                        @click.prevent="auth=!auth"
                    >{{auth?'Регистрация':'Авторизация'}}</div>
                </div>
            </div>
            <div class="card-body">
                <!-- AUTH -->
                <form v-if="auth">
                    <div class="form-group">
                        <label for="login">Логин</label>
                        <input
                            v-model.trim="login"
                            :class="{invalid:($v.validationGroupAuth.login.$dirty && !$v.validationGroupAuth.login.length)}"
                            type="text"
                            class="form-control"
                            id="login"
                        />
                        <small
                            v-if="$v.validationGroupAuth.login.$dirty && !$v.validationGroupAuth.login.length"
                            class="form-text error"
                        >Логин должен быть длиной от 4 до 20 символов,сейчас {{login.length}} символов.</small>
                    </div>
                    <div class="form-group">
                        <label for="Password">Пароль</label>
                        <div class="input-group mb-3">
                            <input
                                v-model.trim="password"
                                :class="{invalid:($v.validationGroupAuth.password.$dirty && !$v.validationGroupAuth.password.length)}"
                                :type="hidePass?'password':'text'"
                                class="form-control"
                                id="Password"
                            />
                            <div class="input-group-append">
                                <div @click="hidePass=!hidePass" class="input-group-text">
                                    <i v-if="hidePass" class="fa fa-eye"></i>
                                    <i v-if="!hidePass" class="fa fa-eye-slash"></i>
                                </div>
                            </div>
                        </div>
                        <small
                            v-if="$v.validationGroupAuth.password.$dirty && !$v.validationGroupAuth.password.length"
                            class="form-text error"
                        >Пароль должен быть длиной от 4 до 20 символов,сейчас {{password.length}} символов.</small>
                    </div>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="$v.validationGroupAuth.$dirty&&$v.validationGroupAuth.$invalid"
                        @click.prevent="authServer()"
                    >Войти</button>
                    <!--  -->
                </form>

                <!-- REGISTER -->
                <form v-if="!auth">
                    <div class="form-group">
                        <label for="newLogin">Логин</label>
                        <input
                            v-model.trim="newLogin"
                            :class="{invalid:($v.validationGroupRegister.newLogin.$dirty && !$v.validationGroupRegister.newLogin.length)}"
                            type="text"
                            class="form-control"
                            id="newLogin"
                        />
                        <small
                            v-if="$v.validationGroupRegister.newLogin.$dirty && !$v.validationGroupRegister.newLogin.length"
                            class="form-text error"
                        >Логин должен быть длиной от 4 до 20 символов,сейчас {{newLogin.length}} символов.</small>
                    </div>
                    <div class="form-group">
                        <label for="newPassword">Пароль</label>
                        <div class="input-group mb-3">
                            <input
                                v-model.trim="newPassword"
                                :class="{invalid:($v.validationGroupRegister.newPassword.$dirty && !$v.validationGroupRegister.newPassword.length)}"
                                :type="hidePass?'password':'text'"
                                class="form-control"
                                id="newPassword"
                            />
                            <div class="input-group-append">
                                <div @click="hidePass=!hidePass" class="input-group-text">
                                    <i v-if="hidePass" class="fa fa-eye"></i>
                                    <i v-if="!hidePass" class="fa fa-eye-slash"></i>
                                </div>
                            </div>
                        </div>
                        <small
                            v-if="$v.validationGroupRegister.newPassword.$dirty && !$v.validationGroupRegister.newPassword.length"
                            class="form-text error"
                        >Пароль должен быть длиной от 4 до 20 символов,сейчас {{newPassword.length}} символов.</small>
                    </div>
                    <div class="form-group">
                        <label for="newPasswordConf">Повторите пароль</label>
                        <div class="input-group mb-3">
                            <input
                                v-model.trim="newPasswordConf"
                                :class="{invalid:($v.validationGroupRegister.newPasswordConf.$dirty && !$v.validationGroupRegister.newPasswordConf.sameAsPassword)}"
                                :type="hidePassConf?'password':'text'"
                                class="form-control"
                                id="newPasswordConf"
                            />
                            <div class="input-group-append">
                                <div @click="hidePassConf=!hidePassConf" class="input-group-text">
                                    <i v-if="hidePassConf" class="fa fa-eye"></i>
                                    <i v-if="!hidePassConf" class="fa fa-eye-slash"></i>
                                </div>
                            </div>
                        </div>
                        <small
                            v-if="$v.validationGroupRegister.newPasswordConf.$dirty && !$v.validationGroupRegister.newPasswordConf.sameAsPassword"
                            class="form-text error"
                        >Пароли не совпадают.</small>
                    </div>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="$v.validationGroupRegister.$dirty&&$v.validationGroupRegister.$invalid"
                        @click.prevent="createUser()"
                    >Зарегистрироваться</button>
                </form>
            </div>
            <div v-if="errorAuth" class="card-footer">Неверный логин или пароль</div>
        </div>
    </div>
</template>

<script>
import { sameAs } from "vuelidate/lib/validators"
import axios from "../axios/axios"
import qs from "qs"
const length = value => value.length >= 4 && value.length <= 20

export default {
    name: "login",
    data() {
        return {
            auth: true,
            hidePass: true,
            hidePassConf: true,
            errorAuth: false,

            login: "",
            password: "",

            newLogin: "",
            newPassword: "",
            newPasswordConf: "",
        }
    },
    validations: {
        login: { length },
        newLogin: { length },
        password: { length },
        newPassword: { length },
        newPasswordConf: { sameAsPassword: sameAs("newPassword") },

        validationGroupAuth: ["login", "password"],
        validationGroupRegister: ["newLogin", "newPassword", "newPasswordConf"],
    },
    methods: {
        async createUser() {
            if (this.$v.validationGroupRegister.$invalid) {
                this.$v.validationGroupRegister.$touch()
                global.console.log(this.$v)
                return
            }
            try {
                const res = await axios.post(`/reg`, qs.stringify({ login: this.newLogin, password: this.newPassword }))
                if (res.data.data) {
                    this.loginFunc(res.data.data)
                } else {
                    this.newLogin = this.newPassword = ""
                    this.errorAuth = true
                }
            } catch (e) {
                console.log(e)
            }
        },
        async authServer() {
            if (this.$v.validationGroupAuth.$invalid) {
                this.$v.validationGroupAuth.$touch()
                global.console.log(this.$v)
                return
            }
            try {
                const res = await axios.post(`/login`, qs.stringify({ login: this.login, password: this.password }))
                if (res.data.data) {
                    this.loginFunc(res.data.data)
                } else {
                    this.login = this.password = ""
                    this.errorAuth = true
                }
            } catch (e) {
                console.log(e)
            }
        },
        loginFunc(data) {
            axios.defaults.headers.common["Authorizations"] = data
            localStorage.setItem("auth", data)
            this.$router.push({ path: `/home` })
        },
    },
}
</script>

<style scoped>
.invalid {
    border: 1px solid red;
}
.error {
    color: red;
}
</style>
