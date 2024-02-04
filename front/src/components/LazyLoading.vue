<template>
    <div class="main-stroke main-backgound shadow">
        <!-- Project info -->
    <div style="padding: calc(24px + var(--figma-ratio)) 12px calc(24px + var(--figma-ratio)) 24px;
                display: flex; 
                flex-direction: column;
                gap: calc(16px + var(--figma-ratio));">

            <div style="display: flex;
                    flex-direction: column;
                    gap: 12px">

                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div class="loading-stripe" style="width: 30%; height: 25px; border-radius: 4px;">
                    </div>
                    <div class="loading-stripe" style="width: 50px; padding: 4px 8px; border-radius: 4px; height: 25px;">
                    </div>
                </div>
                <div class="loading-stripe" style="width: 100%; height: 80px; border-radius: 4px;">

                </div>
            </div>
            <div class="shadow main-background main-stroke" style="padding: 12px 8px;">
                <div style="display: flex; gap: 64px; justify-content: space-between; text-align: center; ">
                    <div class="loading-stripe" style="flex-grow: 1; height: 40px; border-radius: 4px;">
                    </div>
                    <div class="loading-stripe" style="flex-grow: 1; height: 40px; border-radius: 4px;">
                    </div>
                    <div class="loading-stripe" style="flex-grow: 1; height: 40px; border-radius: 4px;">
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style>

.loading-stripe {
    background-color: #3A393E;
    animation: hintloading 3s ease-in-out 0s infinite reverse;
}

@keyframes hintloading
{
  0% {
    opacity: 0.4;
  }
  50%  {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}

</style>