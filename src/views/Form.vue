<template>
<div class="container mt-2">
    <b-form>
        <b-form-group label="Tipo do Bug" label-for="Subject">
            <b-form-input id="subject" v-model.trim="$v.form.subject.$model" type="text" placeholder="Ex: Problema visual, Sonoro, Físico, Litch, Financeiro e etc..." required autocomplete="off" :state="getValidation" aria-describedby="subject-feedback"></b-form-input>

            <b-form-invalid-feedback id="subject-feedback">Campo obrigatório</b-form-invalid-feedback>

        </b-form-group>

        <!--  -->
        <b-form-group class="mt-2" label="Dedalhe do Bug" label-for="description">
            <b-form-textarea id="description" v-model="form.description" type="text" placeholder="Informe datalhadamneto o erro que está acontecendo" required autocomplete="off"></b-form-textarea>
        </b-form-group>

        <b-form-group class=" mt-2" label="Status da tarefa" label-for="status">
            <div class="col-4">
                <b-form-select class="form-select col-8" id="status" v-model="form.status" :options="optionsList"></b-form-select>
            </div>
        </b-form-group>

        <b-form-group class="mt-2" label="Data de vencimento da tarefa" label-for="dateOverdue"
        >
            <div class="col-4">
                <b-form-datepicker
                id="dateOverdue"
                v-model="form.dateOverdue"
                label-no-date-selected="Seleciona uma data"
                :min="getToday()"
                >
                </b-form-datepicker>
            </div>
        </b-form-group>

        <div class="col-4">
            <b-button class="mt-2" type="submit" variant="outline-primary" @click="saveTask">Salvar</b-button>
        </div>
    </b-form>
</div>
</template>

<script>
import ToastMixin from "@/mixins/toastMixin.js";
import {
    required,
    minLength
} from "vuelidate/lib/validators";
import TasksModel from "@/models/TasksModel";
import Status from "@/valueObjects/status";

export default {
    name: "Form",
    mixins: [ToastMixin],

    data() {
        return {
            form: {
                subject: "",
                description: "",
                status: Status.OPEN,
                dateOverdue: ""
            },
            methodSave: "new",

            optionsList: [{
                    value: Status.OPEN,
                    text: "Aberto"
                },
                {
                    value: Status.FINISHED,
                    text: "Concluído"
                },
                {
                    value: Status.ARCHIVED,
                    text: "Arquivado"
                },

            ]
        }
    },

    validations: {
        form: {
            subject: {
                required,
                minLength: minLength(3)
            }
        }
    },

    async created() {
        if (this.$route.params.taskId) {
            this.methodSave = "update";
            this.form = await TasksModel.find(this.$route.params.taskId);
        }
    },

    methods: {
        saveTask() {
            this.$v.$touch();
            if (this.$v.$error) return;

            if (this.methodSave === "update") {
                this.form.save();
                this.showToast("success", "Sucesso!", "Tarefa atualizada com sucesso");
                this.$router.push({
                    name: "list"
                });
                return;
            }

            const task = new TasksModel(this.form);
            task.save();

            this.showToast("success", "Sucesso!", "Tarefa criada com sucesso");
            this.$router.push({
                name: "list"
            });
        },
        getToday() {
           return new Date().toISOString().split("T")[0];
        }
    },
    computed: {
        getValidation() {
            if (this.$v.form.subject.$dirty === false) {
                return null;
            }
            return !this.$v.form.subject.$error;
        }
    }
}
</script>
