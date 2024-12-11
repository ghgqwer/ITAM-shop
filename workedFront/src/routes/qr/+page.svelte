<script lang="ts">
    let url:string;

</script>
<input bind:value={url}/>
<img alt="qr" src={`https://qrtag.net/api/qr.png?url=${url}`} />