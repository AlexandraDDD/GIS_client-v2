/**
 * Отдает список классов по методологии бэм в виде строки
 *
 * @param root название компонента
 *
 * @param block название блока (не обязательно)
 *
 * @param modificators модификаторы (не обязательно)
 * Если значение модификатора интерпретируется как true, то добавляется класс с ключом этого модификатором.
 * Если значение модификатора не является bool типом, то в класс так же добавляется значение этого модификатора:
 * Таким образом с каждым активным модификатором добавляется по одному классу
 *
 * @param mix дополнительные классы (не обязательно)
 *
 * @example
 * bem("participant")("button", { disabled: true, pending: false, type: "machine" }) ->
 *     "participant__button participant__button_disabled participant__button_type_machine"
 */
export const bem =
    (root: string) =>
    (
        block?: string | null | undefined,
        modificators?: Record<string, any> | null | undefined,
        mix?: string[] | string | undefined,
    ) => {
        if (!block && !modificators) {
            return `${root} ${getMix(mix)}`;
        }

        const prefix = block ? `${root}__${block}` : root;

        if (!modificators) {
            return `${prefix} ${getMix(mix)}`;
        }

        let resultString = prefix;

        for (let mod of Object.keys(modificators)) {
            const modValue = modificators[mod];

            if (modValue) {
                resultString += ` ${prefix}_${mod}`;

                if (typeof modValue !== 'boolean') {
                    resultString += `_${modValue}`;
                }
            }
        }

        return `${resultString} ${getMix(mix)}`;
    };

const getMix = (mix: string[] | string | undefined) => {
    if (!mix) {
        return '';
    }

    return Array.isArray(mix) ? mix.join(' ') : mix;
};
