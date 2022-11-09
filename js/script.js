'use strict';

class TodoList {
    dataKey = null;
    #uiContainerElement = null;
    uiContainerSelector = null;

    constructor (dataKey, uiContainerSelector) {
        this.dataKey = dataKey;
        if (typeof uiContainerSelector === "string" || uiContainerSelector.trim() !== "" ) {
            this.uiContainerSelector = uiContainerSelector;
            this.#uiContainerElement = document.querySelector(this.uiContainerSelector);
        }

        this.linkToForm();
        this.linkToContainer();
        this.linkDeleteToItem();
    }

    get dataKey() {
        return this.dataKey;
    }

    set dataKey(value) {
        if(typeof value === "string" || value.trim() !== "" ) {
            this.dataKey = value;
        }
    }

    get uiContainerSelector() {
        return this.uiContainerSelector;
    }


    set uiContainerSelector(value) {
        if (typeof value === "string" || value.trim() !== "" ) {
            this.uiContainerSelector = value;
            this.#uiContainerElement = document.querySelector(this.uiContainerSelector);
        }
    }

    linkToForm () {
        const formElement = document.querySelector(this.dataKey);

        formElement.addEventListener('submit', e => {
            e.preventDefault();
            e.stopPropagation();

            const dataFromInput = {};

            formElement.querySelectorAll('input, textarea')
                .forEach(input => {
                    dataFromInput[input.name] = input.value;
                });

            const dataFromInputSave = this.dataSave(dataFromInput);

            this.renderItem(dataFromInputSave);

        });
    }

    linkToContainer() {
        document.addEventListener('DOMContentLoaded', e => {
            e.preventDefault();

            const dataFromStorage = JSON.parse(localStorage.getItem(this.dataKey));

            if(!dataFromStorage) return 'Local Storage is empty';

            dataFromStorage.map(todoItem => {
                this.renderItem(todoItem);
            });
        });
    }

    dataSave (dataFromInput) {
        let dataFromStorage = localStorage.getItem(this.dataKey);

        if(!dataFromStorage) {
            dataFromInput.id = 1;
            const dataToSave = []; // проблема пустого масиву - як його почистити?
            dataToSave.push(dataFromInput);
            localStorage.setItem(this.dataKey, JSON.stringify(dataToSave));
        }

        if(dataFromStorage) {
            dataFromStorage = JSON.parse(dataFromStorage);

            const lastTodoId = dataFromStorage[dataFromStorage.length - 1].id;
            dataFromInput.id = Number(lastTodoId) + 1;

            dataFromStorage.push(dataFromInput);
            localStorage.setItem(this.dataKey, JSON.stringify(dataFromStorage));
        }

        return dataFromInput;
    }

    renderItem (data) {
        const wrapper = document.createElement('div');

        wrapper.classList.add('col-4');
        wrapper.setAttribute('data-id', data.id);

        wrapper.innerHTML = `
            <div class="taskWrapper">
                    <div class="taskHeading">${data.title}</div>
                    <div class="taskDescription">${data.description}</div>
            </div>`;

        this.#uiContainerElement.prepend(wrapper);
    }

    linkDeleteToItem () {
        this.#uiContainerElement.addEventListener('click', e => {
            e.stopPropagation();

            const currentItem = e.target.closest('[data-id]');
            const currentItemId = Number(currentItem.getAttribute('data-id'));

            const filteredData = JSON
                .parse(localStorage.getItem(this.dataKey))
                .filter(item => item.id !== currentItemId);
            localStorage.setItem(this.dataKey, JSON.stringify(filteredData));

            currentItem.remove();

            if (filteredData.length === 0) localStorage.clear();
        });

    }
}

let myToDo = new TodoList('#todoForm', '#todoItems');
console.log(myToDo);