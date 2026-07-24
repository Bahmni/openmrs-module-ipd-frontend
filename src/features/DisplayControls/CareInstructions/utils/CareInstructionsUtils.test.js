import { filterPreviousShiftInstructions } from './CareInstructionsUtils';

describe('CareInstructionsUtils - filterPreviousShiftInstructions', () => {
    describe('filterPreviousShiftInstructions', () => {
        const currentShiftStartTime = 1704067200000; // 2024-01-01 08:00:00 UTC

        test('should filter instructions created before current shift start', () => {
            const instructions = [
                {
                    observationUuid: 'instruction-1',
                    instruction: 'NPO',
                    encounterDateTime: 1704060000000, // 2024-01-01 06:00:00 UTC (before shift)
                },
                {
                    observationUuid: 'instruction-2',
                    instruction: 'Bed rest',
                    encounterDateTime: 1704070000000, // 2024-01-01 10:00:00 UTC (after shift start)
                },
            ];

            const result = filterPreviousShiftInstructions(instructions, currentShiftStartTime);

            expect(result).toHaveLength(1);
            expect(result[0].observationUuid).toBe('instruction-1');
            expect(result[0].instruction).toBe('NPO');
        });

        test('should return empty array when all instructions are from current shift', () => {
            const instructions = [
                {
                    observationUuid: 'instruction-1',
                    instruction: 'NPO',
                    encounterDateTime: 1704070000000, // after shift start
                },
                {
                    observationUuid: 'instruction-2',
                    instruction: 'Bed rest',
                    encounterDateTime: 1704080000000, // after shift start
                },
            ];

            const result = filterPreviousShiftInstructions(instructions, currentShiftStartTime);

            expect(result).toHaveLength(0);
        });

        test('should return all instructions when all are from previous shift', () => {
            const instructions = [
                {
                    observationUuid: 'instruction-1',
                    instruction: 'NPO',
                    encounterDateTime: 1704050000000, // before shift start
                },
                {
                    observationUuid: 'instruction-2',
                    instruction: 'Bed rest',
                    encounterDateTime: 1704060000000, // before shift start
                },
            ];

            const result = filterPreviousShiftInstructions(instructions, currentShiftStartTime);

            expect(result).toHaveLength(2);
            expect(result.map((i) => i.observationUuid)).toEqual(['instruction-1', 'instruction-2']);
        });

        test('should handle mixed instructions correctly', () => {
            const instructions = [
                {
                    observationUuid: 'instruction-1',
                    instruction: 'NPO',
                    encounterDateTime: 1704050000000, // before shift
                },
                {
                    observationUuid: 'instruction-2',
                    instruction: 'Bed rest',
                    encounterDateTime: 1704070000000, // after shift start
                },
                {
                    observationUuid: 'instruction-3',
                    instruction: 'Medication at 8am',
                    encounterDateTime: 1704045000000, // before shift
                },
                {
                    observationUuid: 'instruction-4',
                    instruction: 'Wound dressing',
                    encounterDateTime: 1704090000000, // after shift start
                },
            ];

            const result = filterPreviousShiftInstructions(instructions, currentShiftStartTime);

            expect(result).toHaveLength(2);
            expect(result.map((i) => i.observationUuid)).toEqual(['instruction-1', 'instruction-3']);
        });

        test('should handle instruction exactly at shift boundary', () => {
            const instructions = [
                {
                    observationUuid: 'instruction-boundary',
                    instruction: 'At boundary',
                    encounterDateTime: currentShiftStartTime, // exactly at shift start
                },
            ];

            const result = filterPreviousShiftInstructions(instructions, currentShiftStartTime);

            // Should not be included (not < shift start)
            expect(result).toHaveLength(0);
        });

        test('should return empty array when input is empty', () => {
            const result = filterPreviousShiftInstructions([], currentShiftStartTime);
            expect(result).toHaveLength(0);
        });

        test('should return empty array when input is null', () => {
            const result = filterPreviousShiftInstructions(null, currentShiftStartTime);
            expect(result).toHaveLength(0);
        });

        test('should return empty array when input is undefined', () => {
            const result = filterPreviousShiftInstructions(undefined, currentShiftStartTime);
            expect(result).toHaveLength(0);
        });

        test('should preserve all fields in filtered instructions', () => {
            const instructions = [
                {
                    observationUuid: 'instruction-1',
                    orderUuid: 'order-123',
                    encounterUuid: 'encounter-456',
                    encounterDateTime: 1704050000000,
                    form: 'Care Instructions Form',
                    instructionType: 'Nursing Instructions',
                    instruction: 'NPO after midnight',
                    providerName: 'Dr. Smith',
                    previousVersionUuid: null,
                    action: '',
                },
            ];

            const result = filterPreviousShiftInstructions(instructions, currentShiftStartTime);

            expect(result).toHaveLength(1);
            const instruction = result[0];
            expect(instruction.observationUuid).toBe('instruction-1');
            expect(instruction.orderUuid).toBe('order-123');
            expect(instruction.encounterUuid).toBe('encounter-456');
            expect(instruction.form).toBe('Care Instructions Form');
            expect(instruction.instructionType).toBe('Nursing Instructions');
            expect(instruction.instruction).toBe('NPO after midnight');
            expect(instruction.providerName).toBe('Dr. Smith');
            expect(instruction.previousVersionUuid).toBeNull();
        });

        test('should handle instructions with previousVersionUuid (edit indicator)', () => {
            const instructions = [
                {
                    observationUuid: 'instruction-1',
                    instruction: 'NPO',
                    encounterDateTime: 1704050000000,
                    previousVersionUuid: 'previous-uuid-123', // indicates this instruction was edited
                },
                {
                    observationUuid: 'instruction-2',
                    instruction: 'Bed rest',
                    encounterDateTime: 1704050000000,
                    previousVersionUuid: null, // original, not edited
                },
            ];

            const result = filterPreviousShiftInstructions(instructions, currentShiftStartTime);

            expect(result).toHaveLength(2);
            // Both should be included in the filter, even if one was edited
            expect(result.some((i) => i.previousVersionUuid === 'previous-uuid-123')).toBe(true);
            expect(result.some((i) => i.previousVersionUuid === null)).toBe(true);
        });

        test('should work with large number of instructions', () => {
            const instructions = [];
            for (let i = 0; i < 1000; i++) {
                instructions.push({
                    observationUuid: `instruction-${i}`,
                    instruction: `Instruction ${i}`,
                    encounterDateTime: i % 2 === 0 ? 1704050000000 : 1704070000000,
                });
            }

            const result = filterPreviousShiftInstructions(instructions, currentShiftStartTime);

            // Should return 500 instructions (those with even index, before shift)
            expect(result).toHaveLength(500);
        });

        test('should not mutate the original array', () => {
            const instructions = [
                {
                    observationUuid: 'instruction-1',
                    instruction: 'NPO',
                    encounterDateTime: 1704050000000,
                },
                {
                    observationUuid: 'instruction-2',
                    instruction: 'Bed rest',
                    encounterDateTime: 1704070000000,
                },
            ];
            const originalLength = instructions.length;

            filterPreviousShiftInstructions(instructions, currentShiftStartTime);

            expect(instructions).toHaveLength(originalLength);
        });

        test('should exclude instruction edited in current shift (previousVersionUuid + current-shift encounterDateTime)', () => {
            const instructions = [{
                observationUuid: 'edited-in-current-shift',
                encounterDateTime: 1704070000000, // after shift start — edited in current shift
                previousVersionUuid: 'original-prev-uuid',
            }];
            expect(filterPreviousShiftInstructions(instructions, currentShiftStartTime)).toHaveLength(0);
        });
    });
});
