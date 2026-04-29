report: report.tex
	pdflatex report.tex
	pdflatex report.tex

clean:
	rm -f *.aux *.log *.out *.pdf
