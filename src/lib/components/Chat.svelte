<script lang="ts">
    import ChatInput from "./chat/ChatInput.svelte";
    import ChatMessage from "./chat/ChatMessage.svelte";
    import ChatAnswers from "./chat/ChatAnswers.svelte";
    import { onMount, tick } from "svelte";
    import { questions } from "$lib";
    import type { Answer, House, Message, Question } from "$lib/types";
    import TestManager from "$lib/testManager";
    import { Progress } from "@skeletonlabs/skeleton-svelte";
    import SpecialMessage from "./chat/SpecialMessage.svelte";
    import { fade } from "svelte/transition";
    
    /* function generateMessages(quantity: number): Message[] { // testing purposes
        const messages: Message[] = [];
        for (let i = 0; i < quantity; i++) {
            messages.push({
                isUser: i % 2 === 0,
                content: lorem
            })            
        }
        return messages;
    }*/

    const questionsIter: ArrayIterator<Question> = questions.values();
    let testManager: TestManager | null = null;
    let viewport: HTMLElement | null = null; // the chat panel element.
    let nameMode = $state<boolean>(false); // whether it is time to input the username.
    let quizEnded = $state<boolean>(false);
    let messages = $state<Message[]>([]);
    let answers = $state<string[]>([]);
    let inputValue = $state<string>("");
    let showAnswers = $state<boolean>(false);
    let showProgressBar = $state<boolean>(false);
    let pendingMessages = $state<number>(0);
    let questionNumber = $state<number>(0);
    const totalQuestions = questions.length;
    let questionPercentage = $derived(Math.round((questionNumber / totalQuestions) * 100));
    let finalHouse = $state<House | null>(null); // the resulting house.

    onMount(() => {
        scrollChatBottom("instant");
        start();
    });
    
    /**
     * Util function to scroll to the end of the chat.
     * @param behavior Type of scroll animation.
     */
    function scrollChatBottom(behavior: ScrollBehavior) {
        if (!viewport) {
            return;
        }

        viewport.scrollTo({ top: viewport.scrollHeight, behavior });
    }

    /**
     * It safely calls the scroll function.
     */
    function autoscroll() {
        if (!viewport) {
            return;
        }

        //const longScroll = viewport.offsetHeight + viewport.scrollTop < viewport.scrollHeight - 50;
        tick().then(() => {
            scrollChatBottom("smooth");
        });
    }

    /**
     * Transfers the user's input from the {@link ChatAnswers} component to the {@link ChatInput} component.
     * @param answer The answer to be transferred.
     */
    function onSelect(answer: string) {
        inputValue = answer;
    }

    /**
     * A Counter Semaphore-like system that synchronizes the messages' and answers' transitions.
     */
    function handleMessageAnimationTransition() {
        pendingMessages--;
        if (!pendingMessages && !nameMode && !quizEnded) {
            showAnswers = true;
            autoscroll();
        }
    }
    
    /**
     * Message sent handler.
     * @param value The contents of the message.
     */
    function onSend(value: string) {
        if (!value) {
            return;
        }

        sendMessage(true, value);
        if (nameMode) {
            testManager = new TestManager(value);
            sendMessage(false, `Alrighty! Let's begin your sorting, ${testManager.name}...`);
            nameMode = false;
            setTimeout(() => {
                generateQuestionMessage();
            }, 300);
            setTimeout(() => {
                showProgressBar = true;
            }, 1000);
        }
        else {
            testManager!.updateScores(value);
            inputValue = "";
            setTimeout(() => {
                generateQuestionMessage();
            }, 200);
        }
    }

    /**
     * Sends a message to the chat panel in a predictable Queue-like manner.
     * @param fromUser Whether the message is coming from the user.
     * @param text The contents of the message.
     */
    function sendMessage(fromUser: boolean, text: string) {
        showAnswers = false;
        setTimeout(() => {
            messages.push({
                isUser: fromUser,
                content: text
            });
            autoscroll();
        }, pendingMessages * 800);
        pendingMessages++;
    }

    /**
     * Pulls and sends the next question from the questions JSON.
     */
    function generateQuestionMessage() {
        const nextQuestion = questionsIter.next();
        if (nextQuestion.done) {
            quizEnded = true;
            revealHouse();
            return;
        }

        questionNumber++;
        const question: Question = nextQuestion.value;
        sendMessage(false, question.title);
        answers = question.answers.map((answer: Answer) => {
            testManager!.addQuestionScores(answer);
            return answer.title;
        });
    }

    /**
     *  Sends the last message.
     */
    function sendSpecialMessage() {
        finalHouse = testManager!.result;
        autoscroll();
    }

    /**
     * Prelude to the last message.
     */
    function revealHouse() {
        sendMessage(false, `${testManager!.name}, you've answered all ${totalQuestions} questions...`);
        sendMessage(false, "The Sorting Hat has made its decision!");
        setTimeout(() => {
            sendSpecialMessage();
        }, pendingMessages * 1200);
    }
    
    /**
     * Entrypoint of the component.
     */
    function start() {
        sendMessage(false, "Welcome! I am the Sorting Hat");
        sendMessage(false, "I will ask you a series of questions to determine which house suits you best");
        sendMessage(false, "But first, could you tell me what is your name?");
        nameMode = true;
    }

</script>

<!--
@component
The main component that manages the chat interface of the test.
-->
<section class="card bg-surface-100-900 rounded-container w-full max-w-[min(80vw,1000px)]">
    {#if showProgressBar}
        <div
            class="p-4"
            in:fade={{ duration: 1000 }}
        >
            <div class="flex justify-between mb-2">
                <span>Question {questionNumber} of {totalQuestions}</span>
                <span>{questionPercentage}%</span>
            </div>
            <Progress
                value={questionNumber}
                max={totalQuestions}
                meterBg="bg-gradient-to-r from-primary-500 to-secondary-500"
            />
        </div>
    {/if}
    <div class="chat w-full h-full">
        <div
            bind:this={viewport}
            class="max-h-[68vh] p-4 overflow-y-auto overflow-x-hidden space-y-4 flex flex-col"
        >
            {#each messages as message (message.content)}
                <ChatMessage
                    {...message}
                    onintroend={handleMessageAnimationTransition}
                />
            {/each}
            {#if showAnswers}
                <ChatAnswers {answers} {onSelect} />
            {/if}
            {#if finalHouse}
                <SpecialMessage {finalHouse} />
            {/if}
        </div>
        <ChatInput {inputValue} {onSend} {nameMode} {quizEnded} />
    </div>
</section>