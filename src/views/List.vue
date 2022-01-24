<template>
<div class="container mt-2">

    <b-card class="admin mb-2">
        <h3 class="mt-2 text-center">Tarefas para ser realizadas</h3>
        <a href="/"><img class="" src="../assets/imagem/exit.png" width="40px" alt=""></a>
    </b-card>

    <b-form inline class=" row mb-2 ">
        <div class="col-3">
            <b-form-input v-model="filter.subject" id="subject" placeholder="Informe a sua pesquisa" class="mr-2" autocomplete="off"></b-form-input>
        </div>

        <div class="col-3">
            <b-form-select v-model="filter.status" :options="optionsList" class="form-select"></b-form-select>
        </div>

        <div class="style-btn col-3">
            <b-button variant="outline-primary" @click="filterTasks">Buscar</b-button>
        </div>
        <div class="style-btn col-3">
            <b-button class="" variant="outline-danger" @click="clearFilter">Limpar</b-button>
        </div>
    </b-form>

    <template v-if="isLoading">
        <div class="loading-spin">
            <b-spinner variant="primary" style="width: 5rem; height: 5rem;"></b-spinner>
        </div>
    </template>

    <template v-if="isTasksEmpty && !isLoading">
        <div class="tela-empty mt-2">
            <img class="img-empty" src="../assets/imagem/empty.svg" height="100vh" alt="">
            <b-button variant="outline-primary" class="mt-2" size="lg" to="/form">Criar uma tarefa</b-button>
        </div>
    </template>

    <template v-if="!isTasksEmpty && !isLoading">
        <div v-for="(task) in tasks" :key="task.id">
            <b-card :class="{'finished-task': isFinished(task) }">
                <b-row>
                    <div class="d-flex justify-content-between">
                        <b-card-title>{{task.subject}}</b-card-title>
                        <span class="cursor-poiter">
                            <!-- class="text-light bg-secondary" -->
                            <!-- :variant="variantOverdue(task.dateOverdue, task.status)" -->

                            <b-button :variant="variantOverdue(task.dateOverdue, task.status)">{{ overduePresenter(task.dateOverdue) }}</b-button>
                        </span>
                    </div>
                    <b-card-text>{{task.description}}</b-card-text>
                    <b-col sm=3>
                        <b-button variant="outline-success" @click="updateStatus(task.id, status.FINISHED)">Concluir
                        </b-button>
                    </b-col>

                    <b-col sm=3>
                        <b-button variant="outline-primary" @click="updateStatus(task.id, status.ARCHIVED)">Arquivar
                        </b-button>
                    </b-col>
                    <b-col sm=3>
                        <b-button variant="outline-primary" @click="edit(task.id)">Editar
                        </b-button>
                    </b-col>
                    <b-col sm=3>
                        <b-button class="mr-2" variant="outline-danger" @click="remove(task.id)">Excluir
                        </b-button>
                    </b-col>
                </b-row>
            </b-card>
        </div>
    </template>

    <b-modal ref="modalRemove" hide-footer title="Excluir tarefa">
        <div class="d-block text-center">
            Deseja realmente excluir essa taarefa? <br>{{ taskSelected.subject }}
        </div>

        <div class="mt-3 d-flex justify-content-end">
            <b-button variant="outline-primary" class="btn-mr-5" @click="hideModal">Cancelar</b-button>
            <b-button variant="outline-danger" class="btn-mr-5" @click="confirmRemoveTask">Excluir</b-button>
        </div>
    </b-modal>
</div>
</template>

<script>
import TasksModel from "@/models/TasksModel";
import Status from "@/valueObjects/status";
import ToastMixin from "@/mixins/toastMixin.js"

export default {
    name: "List",
    mixins: [ToastMixin],

    data() {
        return {
            tasks: [],
            taskSelected: [],
            status: Status,

            filter: {
                subject: null,
                status: null
            },
            optionsList: [{
                    value: null,
                    text: "Selecione algum status"
                },
                {
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
                }
            ],
            isLoading: false
        }
    },

    async created() {
        this.isLoading = true;
        let self = this;

        await setTimeout(function () {
            self.isLoading = false;

        }, 1000)
        this.tasks = await TasksModel.params({
            status: [this.status.OPEN, this.status.FINISHED]
        }).get();
        //    this.isLoading = false;
    },

    methods: {
        edit(taskId) {
            this.$router.push({
                name: "form",
                params: {
                    taskId
                }
            });
        },

        async remove(taskId) {
            this.taskSelected = await TasksModel.find(taskId);
            this.$refs.modalRemove.show();
        },
        hideModal() {
            this.$refs.modalRemove.hide();
        },
        async confirmRemoveTask() {
            this.taskSelected.delete();
            this.tasks = await TasksModel.params({
                status: [this.status.OPEN, this.status.FINISHED]
            }).get();
            this.hideModal();
        },

        async updateStatus(taskId, status) {
            let task = await TasksModel.find(taskId);
            task.status = status,
                await task.save();

            this.tasks = await TasksModel.params({
                status: [this.status.OPEN, this.status.FINISHED]
            }).get();
            this.showToast("success", "Sucesso!", "Tarefa finalizada, parabéns!!");
        },
        isFinished(task) {
            return task.status === this.status.FINISHED;
        },
        async filterTasks() {
            let filter = this.clear(this.filter);
            this.tasks = await TasksModel.params(filter).get();
        },
        clear(obj) {
            for (var propName in obj) {
                if (obj[propName] === null || obj[propName] === undefined) {
                    delete obj[propName];
                }
            }
            return obj;
        },
        async clearFilter() {
            this.filter = {
                subject: null,
                status: null
            };
            this.tasks = await TasksModel.params({
                status: [this.status.OPEN, this.status.FINISHED]
            }).get();
        },
        overduePresenter(dateOverdue) {
            if (!dateOverdue) {
                return
            }
            return dateOverdue.split('-').reverse().join('/');
        },
        variantOverdue(dateOverdue, taskStatus) {
            if (!dateOverdue) {
                return 'light';
            }
            if (taskStatus === this.status.FINISHED) {
                return 'sucess';
            }
            let dateNow = new Date().toISOString().split("T")[0];
            if (dateOverdue === dateNow) {
                return 'warning';
            }
            if (dateOverdue < dateNow) {
                return 'danger';
            }
            return 'light';
        }
    },

    computed: {
        isTasksEmpty() {
            return this.tasks.length === 0;
        }
    }
}
</script>

<style scoped>
.admin {
    text-align: center;
}

.tela-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.img-empty {
    width: 300px;
    height: 300px;
}

.btn-mr-5 {
    margin: 5px;
}

.finished-task {
    opacity: 0.7;
}

.finished-task>.card-body>h4,
.finished-task>.card-body>p {
    text-decoration: line-through;
}

.style-btn {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.cursor-poiter {
    cursor: grabbing;
}

.loading-spin {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 65vh;
}
</style>
