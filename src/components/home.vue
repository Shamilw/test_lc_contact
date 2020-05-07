<template>
    <div class="container" style="width: 45rem;">
        <div class="input-group mb-3 mt-3">
            <input
                type="text"
                class="form-control"
                placeholder="Фильтр по имени/номеру/почте"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
                v-model="imputFilter"
            />
        </div>

        <div>
            <div v-if="!createForm" @click="createForm=true" class="btn btn-primary">Создать</div>

            <form v-if="createForm">
                <div class="form-group">
                    <label for="name">Имя</label>
                    <input
                        type="text"
                        class="form-control"
                        id="name"
                        v-model.trim="newContact.name"
                    />
                </div>
                <div class="form-group">
                    <label for="phone">Телефон</label>
                    <input
                        type="text"
                        class="form-control"
                        id="phone"
                        v-model.trim="newContact.phone"
                    />
                </div>
                <div class="form-group">
                    <label for="Email">Email</label>
                    <input
                        type="text"
                        class="form-control"
                        id="Email"
                        v-model.trim="newContact.email"
                        :class="{invalid:($v.newContact.email.$dirty && !$v.newContact.email.email)}"
                    />
                </div>
                <fieldset class="form-group">
                    <div class="row">
                        <legend class="col-form-label col-sm-2 pt-0">Пол</legend>
                        <div class="col-sm-10">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="gridRadios"
                                    id="gridRadios1"
                                    value="male"
                                    checked
                                    v-model="newContact.sex"
                                />
                                <label class="form-check-label" for="gridRadios1">Мужской</label>
                            </div>
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="gridRadios"
                                    id="gridRadios2"
                                    value="female"
                                    v-model="newContact.sex"
                                />
                                <label class="form-check-label" for="gridRadios2">Женский</label>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </form>
            <div>
                <div v-if="createForm" @click="createForm=false" class="btn btn-danger">Отменить</div>
                <div
                    v-if="createForm"
                    @click="createContact()"
                    class="btn btn-success ml-4"
                >Сохранить</div>
            </div>
        </div>
        <div class="d-flex flex-column">
            <div v-for="contact of filtredContacts" :key="contact._id" class="card mt-3">
                <div class="card-body p-10">
                    <div class="row">
                        <div class="col-auto">
                            <div class="pull-left">
                                <img
                                    class="thumb-lg img-circle bx-s"
                                    :src="contact.sex=='male'?'https://bootdey.com/img/Content/user_1.jpg':' https://bootdey.com/img/Content/user_2.jpg'"
                                    alt
                                />
                            </div>
                            <div>
                                <select
                                    v-if="contact.edit"
                                    v-model="newSex"
                                    class="custom-select mt-2"
                                >
                                    <option value="male">Муж.</option>
                                    <option value="female">Жен.</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="info">
                                <div v-if="!contact.edit">
                                    <h4>{{contact.name}}</h4>
                                    <p class="text-muted">{{contact.phone}}</p>
                                    <i class="fa fa-envelope-o">{{contact.email}}</i>
                                </div>

                                <div v-if="contact.edit">
                                    <input
                                        type="text"
                                        class="form-control mt-1"
                                        :placeholder="contact.name"
                                        v-model="newName "
                                    />
                                    <input
                                        type="text"
                                        class="form-control mt-1"
                                        :placeholder="contact.phone"
                                        v-model="newPhone"
                                    />
                                    <input
                                        type="text"
                                        class="form-control mt-1"
                                        :placeholder="contact.email"
                                        v-model="newEmail"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-auto">
                            <div class="pull-right btn-group-sm">
                                <div
                                    @click="resetEdit(contact),contact.edit=!contact.edit"
                                    class="btn btn-success tooltips m-1"
                                    data-placement="top"
                                    data-toggle="tooltip"
                                    data-original-title="Edit"
                                >
                                    <i v-if="!contact.edit" class="fa fa-pencil"></i>
                                    <span v-if="contact.edit">Отменить</span>
                                </div>
                                <div
                                    @click="deleteContact(contact)"
                                    class="btn btn-danger tooltips m-1"
                                    data-placement="top"
                                    data-toggle="tooltip"
                                    data-original-title="Delete"
                                >
                                    <i class="fa fa-close"></i>
                                </div>

                                <div class="d-flex justify-content-between">
                                    <div
                                        v-if="contact.edit"
                                        class="btn btn-primary tooltips m-1"
                                        @click="editContact(contact)"
                                    >Сохранить</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../axios/axios"
import qs from "qs"
import { email } from "vuelidate/lib/validators"

export default {
    name: "home",
    data() {
        return {
            createForm: false,

            imputFilter: "",
            contacts: [],

            newName: "",
            newPhone: "",
            newEmail: "",
            newSex: "",

            editId: "",
            newContact: {
                name: "",
                phone: "",
                email: "",
                sex: "male",
            },
        }
    },
    validations: {
        newContact: {
            email: { email },
        },
    },
    methods: {
        resetEdit({ _id = "", sex = "" }) {
            if (!this.editId) {
                this.editId = _id
            }
            if (this.editId && this.editId != _id) {
                this.editId = _id
                this.contacts.forEach(c => (c.edit = false))
            }
            this.newName = ""
            this.newPhone = ""
            this.newEmail = ""
            this.newSex = sex
        },
        async loadContacts() {
            const res = await axios.get(`/allcontacts`)
            if (res.data.status == "success") {
                this.contacts = res.data.data.map(el => {
                    el.edit = false
                    return el
                })
            }
        },
        async editContact(contact) {
            const newContact = {
                _id: contact._id,
                name: this.newName || contact.name,
                phone: this.newPhone || contact.phone,
                email: this.newEmail || contact.email,
                sex: this.newSex || contact.sex,
            }
            const res = await axios.put(`/editcontact`, qs.stringify(newContact))
            const updContact = { ...res.data.data, edit: false }
            let ind = this.contacts.findIndex(c => c._id === contact._id)
            this.contacts.splice(ind, 1, updContact)
        },
        async deleteContact({ _id }) {
            const conf = confirm("Удалить контакт?")
            if (conf) {
                const res = await axios.delete(`/delete/${_id}`)
                if (res.data.status == "success") {
                    this.contacts = this.contacts.filter(c => c._id !== _id)
                }
            }
        },
        async createContact() {
            if (this.$v.$invalid) {
                this.$v.$touch()
                return
            }
            if (this.newContact.name && this.newContact.phone && this.newContact.email && this.newContact.sex) {
                const res = await axios.post(`/create`, qs.stringify(this.newContact))
                if (res.data.status == "success") {
                    this.contacts.push(res.data.data)
                }
            } else {
                alert("Заполните все поля.")
            }
        },
    },

    computed: {
        filtredContacts() {
            let filtered = this.contacts.filter(cnt => {
                if (this.getTypeInputFilter === "name") {
                    return this.imputFilter == "" || cnt.name.toLowerCase().indexOf(this.imputFilter.toLowerCase()) > -1
                } else if (this.getTypeInputFilter === "phone") {
                    return this.imputFilter == "" || cnt.phone.indexOf(this.imputFilter.toString()) > -1
                } else {
                    return this.imputFilter == "" || cnt.email.toLowerCase().indexOf(this.imputFilter.toLowerCase()) > -1
                }
            })
            return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        },
        getTypeInputFilter() {
            let number = /^[0-9/+]+$/.test(this.imputFilter)
            if (number) {
                return "phone"
            } else if (this.imputFilter.indexOf("@") >= 0) {
                return "email"
            } else {
                return "name"
            }
        },
    },
    async created() {
        await this.loadContacts()
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
