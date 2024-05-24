import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'maskCardNumber'
})
export class maskCardNumberPipe implements PipeTransform {
    transform(cardNumber: string) {
        if (cardNumber.length !== 19 || !/^(\d{4} \d{4} \d{4} \d{4})$/.test(cardNumber)) {
            return cardNumber; // Devolver el número sin cambios si no tiene el formato esperado
        }
        // Reemplazar los primeros 12 dígitos con asteriscos
        return '**** **** **** ' + cardNumber.slice(-4);
    }
}