<template>
  <div class="container mt-2">
    <b-form>
      <b-form-group  label="Titulo" label-for="Subject">
        <b-form-input
          id="subject"
          v-model="form.subject"
          type="text"
          placeholder="Anotação"
          required
          autocomplete="off"
        ></b-form-input>

        <br>
       <!-- <hr>
          <p>Selecione um das opções de Bug:</p>
          <input type="radio" id="visual" value="visual" v-model="picked">
          <label for="visual" class="mr-2"> Visuais</label>
          <br>
          <input type="radio" id="sonoro" value="sonoro" v-model="picked">
          <label for="sonoro">Sonoro</label>
          <br>
          <input type="radio" id="fisico" value="fisico" v-model="picked">
          <label for="fisico">Físico</label>
          <br>
          <input type="radio" id="litchs" value="litchs" v-model="picked">
          <label for="litchs">Litchs</label>
          <br>
          <input type="radio" id="financeiro" value="financeiro" v-model="picked">
          <label for="financeiro">Financeiro</label>
          <br>
        <hr> -->
        
      </b-form-group>

      <!--  -->
      <b-form-group label="Dedalhe do Bug" label-for="description">
        <b-form-textarea
          id="description"
          v-model="form.description"
          type="text"
          placeholder="Informe datalhadamneto o erro que está acontecendo"
          required
          autocomplete="off"
        ></b-form-textarea>
      </b-form-group>

      <!-- <b-form-group label="Imagem do Bug" label-for="img">
        <b-form-file
          id="img"
          v-model="form.description"
          type="file"
          placeholder="Anexe a imagem do erro"
          autocomplete="off"
        ></b-form-file>
      </b-form-group> -->

      <b-button type="submit" variant="outline-primary" @click="saveTask">Salvar</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "Form",
  data() {
    return {
      form:{
       subject: "",
       description: "" 
      },
      methodSave: "new"
    }
  },

  created() {
    if(this.$route.params.index === 0 || this.$route.params.index !== undefined ){
      this.methodSave = "update";
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      this.form = tasks[this.$route.params.index];
    }
  },

  methods: {
    saveTask() {
      if(this.methodSave === "update"){
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks[this.$route.params.index] = this.form;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        this.$router.push({name: "list"});
        return;
      }


      let tasks = (localStorage.getItem("tasks")) ? JSON.parse(localStorage.getItem("tasks")) : [];
      tasks.push(this.form);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      this.$router.push({name: "list"});
    }
  }
}
</script>
