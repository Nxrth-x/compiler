<script>
  import compiler from './util/compiler'

  let expression = '(sub (div (mult (add 5 4) 2) 10) 5)'
  let abstractSintaxTree = ''
  let parsedExpression = ''

  const parseExpression = () => {
    ;[parsedExpression, abstractSintaxTree] = compiler(expression)
  }
</script>

<svelte:head>
  <title>Test compiler</title>
</svelte:head>

<main>
  <div class="container-left">
    <h1>Test compiler</h1>
    <form on:submit|preventDefault={parseExpression}>
      <div class="input">
        <label for="expression">Type: </label>
        <input
          type="text"
          name="expression"
          bind:value={expression}
          placeholder="Expression..."
        />
      </div>
      <button type="submit">Parse</button>
    </form>
  </div>
  <div class="container-right">
    {#if parsedExpression && abstractSintaxTree}
      <p>Parsed expression: {parsedExpression}</p>
      <div class="ast">
        <p>Abstract sintax tree</p>
        <pre>{abstractSintaxTree ? JSON.stringify(abstractSintaxTree, null, 2) : ''}</pre>
      </div>
    {:else}
      <p>Press 'parse' to compile the expression</p>
    {/if}
  </div>
</main>

<style lang="scss">
  @mixin flex-col() {
    display: flex;
    flex-direction: column;
  }

  main {
    background: #fffafb;
    width: 100%;
    height: 100vh;
    display: block;

    @media (min-width: 900px) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }

  div.container-left {
    padding: 8rem 0;

    @include flex-col();
    align-items: center;
    justify-content: center;

    h1 {
      font-size: 3.5rem;
      letter-spacing: -4px;
    }

    form {
      @include flex-col();

      width: 90%;
      max-width: 24rem;

      input,
      button {
        font-size: 0.9rem;
        transition: 250ms ease-in-out;
      }

      div.input {
        margin: 1rem 0 1.5rem;

        @include flex-col();

        input {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;

          border: 1px solid #ccc;
          border-radius: 0.25rem;

          outline: none;

          &:active,
          &:focus {
            border-color: transparent;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.25);
          }
        }
      }

      button {
        padding: 0.5rem 1rem;

        background: white;
        color: black;

        border: 1.25px solid black;
        border-radius: 0.25rem;

        cursor: pointer;

        &:hover {
          background: #000;
          color: #fff;
        }
      }
    }
  }

  div.container-right {
    padding: 2rem 4rem;

    background: black;
    color: #999;

    overflow: auto;

    & > p {
      font-size: 1.125rem;
      margin-bottom: 1rem;
    }

    div.ast {
      p {
        margin-bottom: 0.5rem;
      }

      pre {
        font-size: 0.9rem;
      }
    }
  }
</style>
